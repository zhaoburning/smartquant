#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from datetime import datetime, timedelta
import pandas as pd
import numpy as np

from data.database import init_db
from analysis.technical import TechnicalIndicator
from strategies.base_strategy import MomentumStrategy, ValueStrategy, BreakoutStrategy
from recommendation.generator import RecommendationGenerator
from trading.simulator import TradingAccount, TradingEngine

print("=" * 60)
print("   SmartQuant - 模拟演示模式")
print("=" * 60)

def generate_mock_data(base_price=10.0, days=100, volatility=0.02):
    dates = [datetime.now() - timedelta(days=i) for i in range(days)]
    dates.reverse()
    
    prices = [base_price]
    for _ in range(1, days):
        change = prices[-1] * np.random.normal(0, volatility)
        prices.append(max(prices[-1] + change, base_price * 0.5))
    
    df = pd.DataFrame({
        "trade_date": [d.date() for d in dates],
        "open_price": prices,
        "close_price": prices,
        "high_price": [p * (1 + np.random.uniform(0, 0.02)) for p in prices],
        "low_price": [p * (1 - np.random.uniform(0, 0.02)) for p in prices],
        "volume": [np.random.randint(1000000, 5000000) for _ in range(days)],
        "amount": [p * vol for p, vol in zip(prices, [np.random.randint(1000000, 5000000) for _ in range(days)])]
    })
    return df

print("\n[1/4] 初始化数据库...")
init_db()
print("✓ 数据库初始化完成")

print("\n[2/4] 生成模拟股票数据...")
mock_stocks = [
    {"code": "600519", "name": "贵州茅台", "price": 1800.0, "trend": "up"},
    {"code": "000858", "name": "五粮液", "price": 140.0, "trend": "up"},
    {"code": "601318", "name": "中国平安", "price": 50.0, "trend": "down"},
    {"code": "000001", "name": "平安银行", "price": 12.0, "trend": "side"},
    {"code": "600036", "name": "招商银行", "price": 35.0, "trend": "up"},
]

mock_data = {}
for stock in mock_stocks:
    df = generate_mock_data(base_price=stock["price"], days=120)
    if stock["trend"] == "up":
        df["close_price"] = df["close_price"] * (1 + np.linspace(0, 0.2, len(df)))
        df["high_price"] = df["high_price"] * (1 + np.linspace(0, 0.2, len(df)))
        df["low_price"] = df["low_price"] * (1 + np.linspace(0, 0.2, len(df)))
        df["open_price"] = df["open_price"] * (1 + np.linspace(0, 0.2, len(df)))
    elif stock["trend"] == "down":
        df["close_price"] = df["close_price"] * (1 - np.linspace(0, 0.1, len(df)))
    mock_data[stock["code"]] = df
    print(f"  ✓ {stock['name']} ({stock['code']})")

print("\n[3/4] 测试技术指标计算...")
df = mock_data["600519"]
df_with_ind = TechnicalIndicator.add_all_indicators(df)
latest = df_with_ind.iloc[-1]
print(f"  MA20: {latest['ma20']:.2f}")
print(f"  MACD: {latest['macd']:.4f}")
print(f"  RSI14: {latest['rsi14']:.2f}")
print(f"  ✓ 技术指标计算完成")

print("\n[4/4] 测试策略评分...")
strategies = [
    ("趋势动量", MomentumStrategy()),
    ("价值成长", ValueStrategy()),
    ("技术突破", BreakoutStrategy())
]

print("\n今日推荐 (模拟数据):")
print("-" * 60)
recommendations = []
for stock in mock_stocks:
    df = mock_data[stock["code"]]
    total_score = 0
    count = 0
    for name, strategy in strategies:
        try:
            score = strategy.calculate_score(df)
            total_score += score
            count += 1
        except:
            pass
    if count > 0:
        final_score = total_score / count
        signal = "强烈推荐" if final_score >= 80 else "推荐" if final_score >= 70 else "观望"
        recommendations.append({
            "stock_code": stock["code"],
            "stock_name": stock["name"],
            "score": final_score,
            "signal": signal,
            "risk_level": "低风险" if final_score >= 70 else "中风险",
            "current_price": df.iloc[-1]["close_price"],
            "target_price": round(df.iloc[-1]["close_price"] * 1.15, 2),
            "stop_loss": round(df.iloc[-1]["close_price"] * 0.92, 2),
            "reasons": ["技术面看好"]
        })

recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:5]
for i, rec in enumerate(recommendations, 1):
    print(f"{i}. {rec['stock_name']} ({rec['stock_code']})")
    print(f"   评分: {rec['score']:.1f} | 信号: {rec['signal']} | 风险: {rec['risk_level']}")
    print(f"   当前价: {rec['current_price']:.2f} | 目标价: {rec['target_price']} | 止损价: {rec['stop_loss']}")
    print("-" * 60)

print("\n[5/5] 模拟交易演示...")
account = TradingAccount(initial_cash=1000000)
engine = TradingEngine(account)

if recommendations:
    rec = recommendations[0]
    shares = int((account.cash * 0.15) / rec["current_price"] / 100) * 100
    if shares > 0:
        engine.buy(rec["stock_code"], rec["stock_name"], rec["current_price"], shares)
        print(f"✓ 买入 {shares} 股 {rec['stock_name']} ({rec['stock_code']})")

summary = account.get_position_summary()
print(f"✓ 总资产: ¥{summary['total_value']:,.2f}")
print(f"✓ 可用现金: ¥{summary['cash']:,.2f}")
if summary["holdings"]:
    holding = summary["holdings"][0]
    print(f"✓ 持仓: {holding['stock_name']} {holding['shares']}股")

print("\n" + "=" * 60)
print("   演示完成！")
print("=" * 60)
print("   注意：由于网络限制，此演示使用模拟数据")
print("   在实际使用中，请确保网络连接正常")
print("=" * 60)
