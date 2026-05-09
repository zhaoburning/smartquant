from datetime import datetime, date
from typing import Dict, List
from config.settings import INITIAL_CAPITAL, RISK_SETTINGS
import logging

logger = logging.getLogger(__name__)

class TradingAccount:
    def __init__(self, initial_cash: float = INITIAL_CAPITAL):
        self.initial_cash = initial_cash
        self.cash = initial_cash
        self.positions: Dict[str, dict] = {}
        self.trade_history: List[dict] = []

    def reset(self):
        self.cash = self.initial_cash
        self.positions = {}
        self.trade_history = []

    def get_total_value(self, market_prices: Dict[str, float] = None) -> float:
        total = self.cash
        for stock_code, pos in self.positions.items():
            if market_prices and stock_code in market_prices:
                price = market_prices[stock_code]
            else:
                price = pos.get("cost", 0)
            total += price * pos["shares"]
        return total

    def get_position_summary(self, market_prices: Dict[str, float] = None) -> Dict:
        holdings = []
        for stock_code, pos in self.positions.items():
            current_price = market_prices.get(stock_code, pos["cost"]) if market_prices else pos["cost"]
            market_value = current_price * pos["shares"]
            cost_value = pos["cost"] * pos["shares"]
            profit = market_value - cost_value
            profit_pct = (current_price - pos["cost"]) / pos["cost"] * 100 if pos["cost"] > 0 else 0
            holdings.append({
                "stock_code": stock_code,
                "stock_name": pos.get("stock_name", stock_code),
                "shares": pos["shares"],
                "cost_price": pos["cost"],
                "current_price": current_price,
                "market_value": market_value,
                "cost_value": cost_value,
                "profit": profit,
                "profit_pct": profit_pct,
                "entry_date": pos.get("entry_date", "")
            })
        total_value = self.get_total_value(market_prices)
        total_profit = total_value - self.initial_cash
        total_profit_pct = (total_profit / self.initial_cash) * 100 if self.initial_cash > 0 else 0
        return {
            "cash": self.cash,
            "holdings": holdings,
            "total_value": total_value,
            "total_profit": total_profit,
            "total_profit_pct": total_profit_pct
        }

class TradingEngine:
    def __init__(self, account: TradingAccount = None):
        self.account = account or TradingAccount()
        self.commission_rate = 0.0003
        self.stamp_tax_rate = 0.001

    def can_buy(self, stock_code: str, price: float, shares: int) -> bool:
        amount = price * shares
        commission = amount * self.commission_rate
        total_cost = amount + commission
        if total_cost > self.account.cash:
            return False
        total_value = self.account.get_total_value()
        max_position_value = self.account.initial_cash * RISK_SETTINGS["max_position_ratio"]
        if stock_code in self.account.positions:
            existing_value = self.account.positions[stock_code]["shares"] * price
            if (existing_value + amount) > max_position_value:
                return False
        elif amount > max_position_value:
            return False
        return True

    def buy(self, stock_code: str, stock_name: str, price: float, shares: int) -> bool:
        if shares % 100 != 0:
            shares = (shares // 100) * 100
            if shares == 0:
                shares = 100
        if not self.can_buy(stock_code, price, shares):
            logger.warning(f"Cannot buy {stock_code}, insufficient cash or position limit")
            return False
        amount = price * shares
        commission = amount * self.commission_rate
        total_cost = amount + commission
        self.account.cash -= total_cost
        if stock_code in self.account.positions:
            pos = self.account.positions[stock_code]
            total_shares = pos["shares"] + shares
            total_cost = pos["cost"] * pos["shares"] + amount
            pos["shares"] = total_shares
            pos["cost"] = total_cost / total_shares
        else:
            self.account.positions[stock_code] = {
                "shares": shares,
                "cost": price,
                "stock_name": stock_name,
                "entry_date": date.today().isoformat()
            }
        self.account.trade_history.append({
            "type": "BUY",
            "stock_code": stock_code,
            "stock_name": stock_name,
            "price": price,
            "shares": shares,
            "amount": amount,
            "commission": commission,
            "time": datetime.now().isoformat()
        })
        logger.info(f"Bought {shares} shares of {stock_code} at {price}")
        return True

    def sell(self, stock_code: str, price: float, shares: int = None) -> bool:
        if stock_code not in self.account.positions:
            logger.warning(f"No position in {stock_code}")
            return False
        pos = self.account.positions[stock_code]
        if shares is None or shares > pos["shares"]:
            shares = pos["shares"]
        amount = price * shares
        commission = amount * self.commission_rate
        stamp_tax = amount * self.stamp_tax_rate
        net_received = amount - commission - stamp_tax
        self.account.cash += net_received
        pos["shares"] -= shares
        if pos["shares"] == 0:
            del self.account.positions[stock_code]
        self.account.trade_history.append({
            "type": "SELL",
            "stock_code": stock_code,
            "stock_name": pos.get("stock_name", stock_code),
            "price": price,
            "shares": shares,
            "amount": amount,
            "commission": commission,
            "stamp_tax": stamp_tax,
            "time": datetime.now().isoformat()
        })
        logger.info(f"Sold {shares} shares of {stock_code} at {price}")
        return True

    def check_stop_loss(self, stock_code: str, current_price: float) -> bool:
        if stock_code not in self.account.positions:
            return False
        pos = self.account.positions[stock_code]
        loss_pct = (current_price - pos["cost"]) / pos["cost"]
        if loss_pct <= -RISK_SETTINGS["stop_loss_percent"]:
            logger.info(f"Stop loss triggered for {stock_code}")
            self.sell(stock_code, current_price)
            return True
        return False
