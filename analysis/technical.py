import pandas as pd
from ta import add_all_ta_features
from ta.utils import dropna
from typing import Dict

class TechnicalIndicator:
    @staticmethod
    def calculate_ma(df: pd.DataFrame, period: int) -> pd.Series:
        return df["close_price"].rolling(window=period).mean()

    @staticmethod
    def calculate_ema(df: pd.DataFrame, period: int) -> pd.Series:
        return df["close_price"].ewm(span=period, adjust=False).mean()

    @staticmethod
    def calculate_macd(df: pd.DataFrame) -> Dict:
        ema12 = TechnicalIndicator.calculate_ema(df, 12)
        ema26 = TechnicalIndicator.calculate_ema(df, 26)
        macd = ema12 - ema26
        signal = macd.ewm(span=9, adjust=False).mean()
        histogram = macd - signal
        return {
            "macd": macd,
            "signal": signal,
            "histogram": histogram
        }

    @staticmethod
    def calculate_kdj(df: pd.DataFrame) -> Dict:
        low_min = df["low_price"].rolling(window=9).min()
        high_max = df["high_price"].rolling(window=9).max()
        rsv = (df["close_price"] - low_min) / (high_max - low_min) * 100
        k = rsv.ewm(span=3, adjust=False).mean()
        d = k.ewm(span=3, adjust=False).mean()
        j = 3 * k - 2 * d
        return {"k": k, "d": d, "j": j}

    @staticmethod
    def calculate_rsi(df: pd.DataFrame, period: int = 14) -> pd.Series:
        delta = df["close_price"].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    @staticmethod
    def calculate_bollinger(df: pd.DataFrame, period: int = 20, std: float = 2.0) -> Dict:
        middle = df["close_price"].rolling(window=period).mean()
        std_dev = df["close_price"].rolling(window=period).std()
        upper = middle + std * std_dev
        lower = middle - std * std_dev
        return {"upper": upper, "middle": middle, "lower": lower}

    @staticmethod
    def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
        high_low = df["high_price"] - df["low_price"]
        high_close = (df["high_price"] - df["close_price"].shift()).abs()
        low_close = (df["low_price"] - df["close_price"].shift()).abs()
        tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
        return tr.rolling(window=period).mean()

    @staticmethod
    def calculate_volatility(df: pd.DataFrame, period: int = 20) -> float:
        returns = df["close_price"].pct_change().dropna()
        return returns.tail(period).std()

    @staticmethod
    def add_all_indicators(df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["ma5"] = TechnicalIndicator.calculate_ma(df, 5)
        df["ma10"] = TechnicalIndicator.calculate_ma(df, 10)
        df["ma20"] = TechnicalIndicator.calculate_ma(df, 20)
        df["ma60"] = TechnicalIndicator.calculate_ma(df, 60)
        df["ema12"] = TechnicalIndicator.calculate_ema(df, 12)
        df["ema26"] = TechnicalIndicator.calculate_ema(df, 26)
        macd = TechnicalIndicator.calculate_macd(df)
        df["macd"] = macd["macd"]
        df["macd_signal"] = macd["signal"]
        df["macd_hist"] = macd["histogram"]
        kdj = TechnicalIndicator.calculate_kdj(df)
        df["kdj_k"] = kdj["k"]
        df["kdj_d"] = kdj["d"]
        df["kdj_j"] = kdj["j"]
        df["rsi14"] = TechnicalIndicator.calculate_rsi(df, 14)
        boll = TechnicalIndicator.calculate_bollinger(df)
        df["boll_upper"] = boll["upper"]
        df["boll_middle"] = boll["middle"]
        df["boll_lower"] = boll["lower"]
        df["atr"] = TechnicalIndicator.calculate_atr(df)
        df["vol_ma20"] = df["volume"].rolling(20).mean()
        return df
