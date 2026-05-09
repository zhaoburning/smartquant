import pandas as pd
from datetime import datetime
from data.database import get_db_session, StockInfo, DailyQuote, FinancialData
from data.data_source import DataSource
import logging

logger = logging.getLogger(__name__)

class DataManager:
    def __init__(self):
        self.session = get_db_session()
        self.data_source = DataSource()

    def update_stock_list(self):
        try:
            stock_list = self.data_source.get_stock_list()
            for _, row in stock_list.iterrows():
                existing = self.session.query(StockInfo).filter(
                    StockInfo.stock_code == row["stock_code"]
                ).first()
                if not existing:
                    stock_info = StockInfo(
                        stock_code=row["stock_code"],
                        stock_name=row["stock_name"],
                        update_time=datetime.now()
                    )
                    self.session.add(stock_info)
            self.session.commit()
            logger.info(f"Updated stock list, total {len(stock_list)} stocks")
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to update stock list: {e}")

    def get_all_stocks(self) -> pd.DataFrame:
        stocks = self.session.query(StockInfo).all()
        data = []
        for stock in stocks:
            data.append({
                "stock_code": stock.stock_code,
                "stock_name": stock.stock_name
            })
        return pd.DataFrame(data)

    def save_daily_quote(self, stock_code: str, df: pd.DataFrame):
        if df.empty:
            return
        for _, row in df.iterrows():
            existing = self.session.query(DailyQuote).filter(
                DailyQuote.stock_code == stock_code,
                DailyQuote.trade_date == row["trade_date"]
            ).first()
            if existing:
                existing.open_price = row.get("open_price")
                existing.high_price = row.get("high_price")
                existing.low_price = row.get("low_price")
                existing.close_price = row.get("close_price")
                existing.volume = row.get("volume")
                existing.amount = row.get("amount")
                existing.change_pct = row.get("change_pct")
            else:
                quote = DailyQuote(
                    stock_code=stock_code,
                    trade_date=row["trade_date"],
                    open_price=row.get("open_price"),
                    high_price=row.get("high_price"),
                    low_price=row.get("low_price"),
                    close_price=row.get("close_price"),
                    volume=row.get("volume"),
                    amount=row.get("amount"),
                    change_pct=row.get("change_pct")
                )
                self.session.add(quote)
        self.session.commit()

    def get_daily_quotes(self, stock_code: str, days: int = 252) -> pd.DataFrame:
        quotes = self.session.query(DailyQuote).filter(
            DailyQuote.stock_code == stock_code
        ).order_by(DailyQuote.trade_date.desc()).limit(days).all()
        data = []
        for quote in quotes:
            data.append({
                "trade_date": quote.trade_date,
                "open_price": quote.open_price,
                "high_price": quote.high_price,
                "low_price": quote.low_price,
                "close_price": quote.close_price,
                "volume": quote.volume,
                "amount": quote.amount,
                "change_pct": quote.change_pct,
                "pe": quote.pe,
                "pb": quote.pb,
                "market_cap": quote.market_cap
            })
        df = pd.DataFrame(data)
        if not df.empty:
            df = df.sort_values("trade_date").reset_index(drop=True)
        return df

    def close(self):
        self.session.close()
