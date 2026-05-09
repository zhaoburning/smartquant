import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
from datetime import datetime, date
from dataclasses import dataclass
from strategies.base_strategy import BaseStrategy
from config.settings import INITIAL_CAPITAL, RISK_SETTINGS

@dataclass
class Trade:
    stock_code: str
    trade_date: date
    action: str
    price: float
    shares: int
    amount: float

@dataclass
class PerformanceMetrics:
    total_return: float
    annual_return: float
    max_drawdown: float
    sharpe_ratio: float
    win_rate: float
    profit_loss_ratio: float
    total_trades: int
    winning_trades: int

class BacktestEngine:
    def __init__(self, initial_capital: float = INITIAL_CAPITAL):
        self.initial_capital = initial_capital
        self.reset()

    def reset(self):
        self.cash = self.initial_capital
        self.positions = {}
        self.trades = []
        self.equity_curve = [self.initial_capital]
        self.dates = []

    def calculate_position_size(self, price: float) -> int:
        max_position_value = self.initial_capital * RISK_SETTINGS["max_position_ratio"]
        shares = int(max_position_value / price / 100) * 100
        return max(shares, 100)

    def buy(self, stock_code: str, price: float, shares: int, trade_date: date):
        amount = price * shares
        if amount > self.cash:
            return False
        self.cash -= amount
        if stock_code in self.positions:
            pos = self.positions[stock_code]
            total_shares = pos["shares"] + shares
            total_cost = pos["cost"] * pos["shares"] + amount
            self.positions[stock_code] = {
                "shares": total_shares,
                "cost": total_cost / total_shares,
                "entry_date": trade_date
            }
        else:
            self.positions[stock_code] = {
                "shares": shares,
                "cost": price,
                "entry_date": trade_date
            }
        self.trades.append(Trade(
            stock_code=stock_code,
            trade_date=trade_date,
            action="BUY",
            price=price,
            shares=shares,
            amount=amount
        ))
        return True

    def sell(self, stock_code: str, price: float, shares: int, trade_date: date):
        if stock_code not in self.positions:
            return False
        pos = self.positions[stock_code]
        if shares > pos["shares"]:
            shares = pos["shares"]
        amount = price * shares
        self.cash += amount
        pos["shares"] -= shares
        if pos["shares"] == 0:
            del self.positions[stock_code]
        self.trades.append(Trade(
            stock_code=stock_code,
            trade_date=trade_date,
            action="SELL",
            price=price,
            shares=shares,
            amount=amount
        ))
        return True

    def calculate_total_value(self, prices: Dict[str, float]) -> float:
        total = self.cash
        for stock_code, pos in self.positions.items():
            if stock_code in prices:
                total += prices[stock_code] * pos["shares"]
        return total

    def calculate_metrics(self, equity_curve: List[float], dates: List[date]) -> PerformanceMetrics:
        if len(equity_curve) < 2:
            return PerformanceMetrics(0, 0, 0, 0, 0, 0, 0, 0)
        returns = pd.Series(equity_curve).pct_change().dropna()
        total_return = (equity_curve[-1] - equity_curve[0]) / equity_curve[0]
        if len(dates) > 1:
            days = (dates[-1] - dates[0]).days
            if days > 0:
                annual_return = (1 + total_return) ** (365 / days) - 1
            else:
                annual_return = 0
        else:
            annual_return = 0
        cumulative = (1 + returns).cumprod()
        peak = cumulative.expanding().max()
        drawdown = (cumulative - peak) / peak
        max_drawdown = drawdown.min()
        risk_free_rate = 0.03
        excess_returns = returns - risk_free_rate / 252
        if excess_returns.std() > 0:
            sharpe_ratio = excess_returns.mean() / excess_returns.std() * np.sqrt(252)
        else:
            sharpe_ratio = 0
        buy_trades = [t for t in self.trades if t.action == "BUY"]
        sell_trades = [t for t in self.trades if t.action == "SELL"]
        total_trades = len(buy_trades)
        if total_trades == 0:
            return PerformanceMetrics(
                total_return=total_return,
                annual_return=annual_return,
                max_drawdown=max_drawdown,
                sharpe_ratio=sharpe_ratio,
                win_rate=0,
                profit_loss_ratio=0,
                total_trades=0,
                winning_trades=0
            )
        winning_trades = 0
        total_profit = 0
        total_loss = 0
        for i, sell_trade in enumerate(sell_trades):
            if i < len(buy_trades):
                buy_trade = buy_trades[i]
                profit = (sell_trade.price - buy_trade.price) * buy_trade.shares
                if profit > 0:
                    winning_trades += 1
                    total_profit += profit
                else:
                    total_loss -= profit
        win_rate = winning_trades / total_trades if total_trades > 0 else 0
        profit_loss_ratio = total_profit / total_loss if total_loss > 0 else float('inf')
        return PerformanceMetrics(
            total_return=total_return,
            annual_return=annual_return,
            max_drawdown=max_drawdown,
            sharpe_ratio=sharpe_ratio,
            win_rate=win_rate,
            profit_loss_ratio=profit_loss_ratio,
            total_trades=total_trades,
            winning_trades=winning_trades
        )

    def run(self, data_dict: Dict[str, pd.DataFrame], strategy: BaseStrategy, 
            start_date: date = None, end_date: date = None) -> PerformanceMetrics:
        self.reset()
        date_indexes = {}
        for stock_code, df in data_dict.items():
            df_sorted = df.sort_values("trade_date")
            date_indexes[stock_code] = df_sorted.set_index("trade_date")
        all_dates = set()
        for stock_code, df in data_dict.items():
            all_dates.update(df["trade_date"].values)
        all_dates = sorted(all_dates)
        if start_date:
            all_dates = [d for d in all_dates if d >= start_date]
        if end_date:
            all_dates = [d for d in all_dates if d <= end_date]
        for i, current_date in enumerate(all_dates):
            current_prices = {}
            for stock_code, df_index in date_indexes.items():
                if current_date in df_index.index:
                    current_prices[stock_code] = df_index.loc[current_date]["close_price"]
            for stock_code, df in data_dict.items():
                if current_date in df["trade_date"].values:
                    stock_data = df[df["trade_date"] <= current_date].copy()
                    if len(stock_data) < 20:
                        continue
                    results = strategy.select_stocks(stock_data)
                    if results and stock_code not in self.positions:
                        score = results[0]["score"]
                        if score >= 70 and current_prices.get(stock_code):
                            shares = self.calculate_position_size(current_prices[stock_code])
                            self.buy(stock_code, current_prices[stock_code], shares, current_date)
                    for stock_code in list(self.positions.keys()):
                        if stock_code in current_prices:
                            pos = self.positions[stock_code]
                            entry_date = pos["entry_date"]
                            days_held = (current_date - entry_date).days
                            pct_change = (current_prices[stock_code] - pos["cost"]) / pos["cost"]
                            should_sell = False
                            if pct_change <= -RISK_SETTINGS["stop_loss_percent"]:
                                should_sell = True
                            elif days_held >= RISK_SETTINGS["max_holding_days"]:
                                should_sell = True
                            if should_sell:
                                self.sell(stock_code, current_prices[stock_code], pos["shares"], current_date)
            total_value = self.calculate_total_value(current_prices)
            self.equity_curve.append(total_value)
            self.dates.append(current_date)
        if self.dates and len(self.dates) > 0:
            last_date = self.dates[-1]
            last_prices = {}
            for stock_code, df_index in date_indexes.items():
                if last_date in df_index.index:
                    last_prices[stock_code] = df_index.loc[last_date]["close_price"]
            for stock_code in list(self.positions.keys()):
                if stock_code in last_prices:
                    self.sell(stock_code, last_prices[stock_code], self.positions[stock_code]["shares"], last_date)
        return self.calculate_metrics(self.equity_curve, self.dates)
