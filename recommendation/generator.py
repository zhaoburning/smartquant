import pandas as pd
from datetime import date, datetime
from typing import List, Dict
from data.data_source import DataSource
from data.cache import DataManager
from strategies.base_strategy import MomentumStrategy, ValueStrategy, BreakoutStrategy
from data.database import Recommendation, get_db_session
import json
import logging

logger = logging.getLogger(__name__)

class StockScorer:
    def __init__(self):
        self.strategies = {
            "momentum": MomentumStrategy(),
            "value": ValueStrategy(),
            "breakout": BreakoutStrategy()
        }

    def score_stock(self, df: pd.DataFrame, quote: Dict = None) -> Dict:
        if len(df) < 20:
            return {"total_score": 0, "signals": [], "reasons": []}
        scores = {}
        reasons = []
        for name, strategy in self.strategies.items():
            try:
                results = strategy.select_stocks(df)
                if results:
                    scores[name] = results[0]["score"]
                    if results[0]["score"] >= 70:
                        reasons.append(f"{name}策略看好，得分{results[0]['score']}")
            except Exception as e:
                logger.error(f"Error scoring with {name} strategy: {e}")
        if not scores:
            return {"total_score": 0, "signals": [], "reasons": reasons}
        total_score = sum(scores.values()) / len(scores)
        technical_score = self.score_technical(df)
        final_score = total_score * 0.7 + technical_score * 0.3
        return {
            "total_score": min(final_score, 100),
            "signals": scores,
            "reasons": reasons
        }

    def score_technical(self, df: pd.DataFrame) -> float:
        if len(df) < 20:
            return 0.0
        latest = df.iloc[-1]
        score = 0.0
        if latest.get("ma20") and latest.get("close_price"):
            if latest["close_price"] > latest["ma20"]:
                score += 30
        if latest.get("macd_hist"):
            if latest["macd_hist"] > 0:
                score += 20
        if latest.get("rsi14"):
            if 30 < latest["rsi14"] < 70:
                score += 20
        if latest.get("volume") and latest.get("vol_ma20"):
            if latest["volume"] > latest["vol_ma20"] * 1.2:
                score += 30
        return min(score, 100)

class RecommendationGenerator:
    def __init__(self):
        self.data_source = DataSource()
        self.data_manager = DataManager()
        self.scorer = StockScorer()
        self.session = get_db_session()

    def generate_daily_recommendations(self, limit: int = 5) -> List[Dict]:
        stock_list = self.data_source.get_stock_list()
        if stock_list.empty:
            logger.warning("No stock list available")
            return []
        sample_size = min(200, len(stock_list))
        stock_list = stock_list.sample(n=sample_size, random_state=42)
        recommendations = []
        for _, row in stock_list.iterrows():
            try:
                stock_code = row["stock_code"]
                stock_name = row["stock_name"]
                df = self.data_source.get_historical_data(stock_code, days=100)
                if df.empty or len(df) < 30:
                    continue
                quote = self.data_source.get_realtime_quote(stock_code)
                score_result = self.scorer.score_stock(df, quote)
                if score_result["total_score"] >= 70:
                    latest_price = df.iloc[-1]["close_price"]
                    recommendations.append({
                        "stock_code": stock_code,
                        "stock_name": stock_name,
                        "score": score_result["total_score"],
                        "signal": self.get_signal(score_result["total_score"]),
                        "reasons": score_result["reasons"],
                        "risk_level": self.get_risk_level(df),
                        "current_price": latest_price,
                        "target_price": round(latest_price * 1.15, 2),
                        "stop_loss": round(latest_price * 0.92, 2),
                        "position_ratio": 0.15
                    })
            except Exception as e:
                logger.error(f"Error processing {row.get('stock_code', 'unknown')}: {e}")
        recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:limit]
        self.save_recommendations(recommendations)
        return recommendations

    def get_signal(self, score: float) -> str:
        if score >= 85:
            return "强烈推荐"
        elif score >= 75:
            return "推荐"
        else:
            return "观望"

    def get_risk_level(self, df: pd.DataFrame) -> str:
        if len(df) < 20:
            return "未知"
        returns = df["close_price"].pct_change().dropna()
        volatility = returns.tail(20).std()
        if volatility < 0.02:
            return "低风险"
        elif volatility < 0.035:
            return "中风险"
        else:
            return "高风险"

    def save_recommendations(self, recommendations: List[Dict]):
        try:
            today = date.today()
            for rec in recommendations:
                existing = self.session.query(Recommendation).filter(
                    Recommendation.date == today,
                    Recommendation.stock_code == rec["stock_code"]
                ).first()
                if existing:
                    existing.score = rec["score"]
                    existing.signal = rec["signal"]
                    existing.reasons = json.dumps(rec["reasons"], ensure_ascii=False)
                    existing.risk_level = rec["risk_level"]
                    existing.target_price = rec["target_price"]
                    existing.stop_loss = rec["stop_loss"]
                    existing.position_ratio = rec["position_ratio"]
                else:
                    new_rec = Recommendation(
                        date=today,
                        stock_code=rec["stock_code"],
                        stock_name=rec["stock_name"],
                        score=rec["score"],
                        signal=rec["signal"],
                        reasons=json.dumps(rec["reasons"], ensure_ascii=False),
                        risk_level=rec["risk_level"],
                        target_price=rec["target_price"],
                        stop_loss=rec["stop_loss"],
                        position_ratio=rec["position_ratio"]
                    )
                    self.session.add(new_rec)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to save recommendations: {e}")

    def get_latest_recommendations(self) -> List[Dict]:
        try:
            today = date.today()
            recs = self.session.query(Recommendation).filter(
                Recommendation.date == today
            ).order_by(Recommendation.score.desc()).all()
            return [
                {
                    "stock_code": r.stock_code,
                    "stock_name": r.stock_name,
                    "score": r.score,
                    "signal": r.signal,
                    "reasons": json.loads(r.reasons) if r.reasons else [],
                    "risk_level": r.risk_level,
                    "target_price": r.target_price,
                    "stop_loss": r.stop_loss,
                    "position_ratio": r.position_ratio
                }
                for r in recs
            ]
        except Exception as e:
            logger.error(f"Failed to get recommendations: {e}")
            return []
