from abc import ABC, abstractmethod
from typing import List, Dict
import pandas as pd
from analysis.technical import TechnicalIndicator
from config.settings import STRATEGY_PARAMS

class BaseStrategy(ABC):
    def __init__(self, name: str):
        self.name = name
        self.params = STRATEGY_PARAMS.get(name, {})

    @abstractmethod
    def select_stocks(self, df: pd.DataFrame) -> List[Dict]:
        pass

    @abstractmethod
    def calculate_score(self, df: pd.DataFrame) -> float:
        pass

    def calculate_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        return TechnicalIndicator.add_all_indicators(df)

    def get_signal(self, score: float) -> str:
        if score >= 80:
            return "强烈推荐"
        elif score >= 70:
            return "推荐"
        elif score >= 60:
            return "观望"
        else:
            return "不推荐"

class MomentumStrategy(BaseStrategy):
    def __init__(self):
        super().__init__("momentum")

    def calculate_score(self, df: pd.DataFrame) -> float:
        if len(df) < 60:
            return 0.0
        latest = df.iloc[-1]
        score = 0.0
        if latest.get("ma20") and latest.get("ma60"):
            if latest["ma20"] > latest["ma60"]:
                score += 25
        if latest.get("macd") and latest.get("macd_signal"):
            if latest["macd"] > latest["macd_signal"] and latest["macd"] > 0:
                score += 20
        if len(df) >= 20:
            return_20 = (df.iloc[-1]["close_price"] - df.iloc[-20]["close_price"]) / df.iloc[-20]["close_price"]
            if self.params.get("min_gain", 0.05) <= return_20 <= 0.3:
                score += 20
        if latest.get("volume") and latest.get("vol_ma20"):
            if latest["volume"] > latest["vol_ma20"] * self.params.get("volume_ratio", 1.5):
                score += 20
        if latest.get("close_price") and latest.get("boll_middle"):
            if latest["close_price"] > latest["boll_middle"]:
                score += 15
        return min(score, 100)

    def select_stocks(self, df: pd.DataFrame) -> List[Dict]:
        if len(df) < 60:
            return []
        df = self.calculate_indicators(df)
        latest = df.iloc[-1]
        results = []
        score = self.calculate_score(df)
        signal = self.get_signal(score)
        if score >= 70:
            results.append({
                "score": score,
                "signal": signal,
                "strategy": self.name
            })
        return results

class ValueStrategy(BaseStrategy):
    def __init__(self):
        super().__init__("value")

    def calculate_score(self, df: pd.DataFrame) -> float:
        if len(df) < 20:
            return 0.0
        latest = df.iloc[-1]
        score = 0.0
        if latest.get("pe"):
            if self.params.get("min_pe", 15) <= latest["pe"] <= self.params.get("max_pe", 30):
                score += 30
            elif 10 <= latest["pe"] < self.params.get("min_pe", 15):
                score += 20
        if latest.get("pb"):
            if latest["pb"] <= self.params.get("max_pb", 3):
                score += 30
        if len(df) >= 20:
            return_20 = (df.iloc[-1]["close_price"] - df.iloc[-20]["close_price"]) / df.iloc[-20]["close_price"]
            if -0.05 <= return_20 <= 0.15:
                score += 20
        if latest.get("kdj_k") and latest.get("kdj_d"):
            if latest["kdj_k"] > latest["kdj_d"] and latest["kdj_k"] < 50:
                score += 20
        return min(score, 100)

    def select_stocks(self, df: pd.DataFrame) -> List[Dict]:
        if len(df) < 20:
            return []
        df = self.calculate_indicators(df)
        score = self.calculate_score(df)
        signal = self.get_signal(score)
        results = []
        if score >= 65:
            results.append({
                "score": score,
                "signal": signal,
                "strategy": self.name
            })
        return results

class BreakoutStrategy(BaseStrategy):
    def __init__(self):
        super().__init__("breakout")

    def calculate_score(self, df: pd.DataFrame) -> float:
        if len(df) < 20:
            return 0.0
        latest = df.iloc[-1]
        score = 0.0
        if len(df) >= 20:
            highest_20 = df.iloc[-20:-1]["high_price"].max()
            if latest["close_price"] > highest_20:
                score += 35
        if latest.get("volume") and latest.get("vol_ma20"):
            if latest["volume"] > latest["vol_ma20"] * self.params.get("volume_multiplier", 2):
                score += 30
        if len(df) >= 1:
            change_pct = latest.get("change_pct", 0)
            if self.params.get("min_gain", 0.03) <= change_pct <= self.params.get("max_gain", 0.08):
                score += 20
        if latest.get("rsi14"):
            if latest["rsi14"] < self.params.get("max_rsi", 70):
                score += 15
        return min(score, 100)

    def select_stocks(self, df: pd.DataFrame) -> List[Dict]:
        if len(df) < 20:
            return []
        df = self.calculate_indicators(df)
        score = self.calculate_score(df)
        signal = self.get_signal(score)
        results = []
        if score >= 70:
            results.append({
                "score": score,
                "signal": signal,
                "strategy": self.name
            })
        return results
