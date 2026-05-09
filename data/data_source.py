import akshare as ak
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataSource:
    @staticmethod
    def get_stock_list() -> pd.DataFrame:
        try:
            stock_list = ak.stock_info_a_code_name()
            stock_list.columns = ["stock_code", "stock_name"]
            return stock_list
        except Exception as e:
            logger.error(f"Failed to get stock list: {e}")
            return pd.DataFrame()

    @staticmethod
    def get_historical_data(stock_code: str, days: int = 252) -> pd.DataFrame:
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days * 1.5)
            df = ak.stock_zh_a_hist(
                symbol=stock_code,
                period="daily",
                start_date=start_date.strftime("%Y%m%d"),
                end_date=end_date.strftime("%Y%m%d"),
                adjust="qfq"
            )
            if df.empty:
                return df
            df.columns = [
                "trade_date", "open_price", "close_price", "high_price", "low_price", 
                "volume", "amount", "change", "change_pct", "turnover"
            ]
            df["trade_date"] = pd.to_datetime(df["trade_date"]).dt.date
            df = df.sort_values("trade_date").reset_index(drop=True)
            return df
        except Exception as e:
            logger.error(f"Failed to get historical data for {stock_code}: {e}")
            return pd.DataFrame()

    @staticmethod
    def get_realtime_quote(stock_code: str) -> Optional[Dict]:
        try:
            df = ak.stock_zh_a_spot_em()
            df = df[df["代码"] == stock_code]
            if df.empty:
                return None
            return {
                "stock_code": df.iloc[0]["代码"],
                "stock_name": df.iloc[0]["名称"],
                "open_price": df.iloc[0]["今开"],
                "high_price": df.iloc[0]["最高"],
                "low_price": df.iloc[0]["最低"],
                "close_price": df.iloc[0]["最新价"],
                "volume": df.iloc[0]["成交量"],
                "amount": df.iloc[0]["成交额"],
                "change_pct": df.iloc[0]["涨跌幅"],
                "turnover": df.iloc[0]["换手率"],
                "pe": df.iloc[0]["市盈率-动态"],
                "pb": df.iloc[0]["市净率"]
            }
        except Exception as e:
            logger.error(f"Failed to get realtime quote for {stock_code}: {e}")
            return None

    @staticmethod
    def get_financial_data(stock_code: str) -> Optional[Dict]:
        try:
            df = ak.stock_financial_abstract_ths(symbol=stock_code)
            if df.empty:
                return None
            return {
                "stock_code": stock_code,
                "roe": df.iloc[0].get("净资产收益率", None),
                "revenue": df.iloc[0].get("营业总收入", None),
                "profit": df.iloc[0].get("净利润", None)
            }
        except Exception as e:
            logger.error(f"Failed to get financial data for {stock_code}: {e}")
            return None

    @staticmethod
    def get_index_data(index_code: str = "000001") -> pd.DataFrame:
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=365)
            df = ak.index_zh_a_hist(
                symbol=index_code,
                period="daily",
                start_date=start_date.strftime("%Y%m%d"),
                end_date=end_date.strftime("%Y%m%d")
            )
            df.columns = ["trade_date", "open_price", "close_price", "high_price", "low_price", "volume", "amount"]
            df["trade_date"] = pd.to_datetime(df["trade_date"]).dt.date
            return df
        except Exception as e:
            logger.error(f"Failed to get index data: {e}")
            return pd.DataFrame()
