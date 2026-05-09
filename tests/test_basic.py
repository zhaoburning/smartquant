#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from data.database import init_db
from data.data_source import DataSource
from analysis.technical import TechnicalIndicator
from strategies.base_strategy import MomentumStrategy, ValueStrategy, BreakoutStrategy
import pandas as pd

print("=" * 60)
print("   SmartQuant - 基础功能测试")
print("=" * 60)

def test_data_source():
    print("\n[1/5] 测试数据源...")
    data_source = DataSource()
    
    print("  获取股票列表...")
    stocks = data_source.get_stock_list()
    if not stocks.empty:
        print(f"  ✓ 获取到 {len(stocks)} 只股票")
        print(f"  示例: {stocks.iloc[0]['stock_code']} {stocks.iloc[0]['stock_name']}")
    else:
        print("  ✗ 未获取到股票列表")
    
    test_stock = "600000"
    print(f"\n  获取 {test_stock} 历史数据...")
    df = data_source.get_historical_data(test_stock, days=60)
    if not df.empty:
        print(f"  ✓ 获取到 {len(df)} 天数据")
        print(f"  日期范围: {df['trade_date'].min()} ~ {df['trade_date'].max()}")
    else:
        print(f"  ✗ 未获取到 {test_stock} 数据")
    
    print(f"\n  获取 {test_stock} 实时行情...")
    quote = data_source.get_realtime_quote(test_stock)
    if quote:
        print(f"  ✓ 实时价格: {quote.get('close_price', 'N/A')}")
    else:
        print(f"  ✗ 未获取到实时行情")
    
    return df

def test_technical_indicators(df):
    print("\n[2/5] 测试技术指标...")
    if df.empty:
        print("  ✗ 无数据，跳过")
        return None
    
    df_with_indicators = TechnicalIndicator.add_all_indicators(df)
    latest = df_with_indicators.iloc[-1]
    
    print("  MA20:", round(latest.get("ma20", 0), 2))
    print("  MACD:", round(latest.get("macd", 0), 4))
    print("  RSI14:", round(latest.get("rsi14", 0), 2))
    print("  ✓ 技术指标计算完成")
    
    return df_with_indicators

def test_strategies(df):
    print("\n[3/5] 测试策略...")
    if df.empty or len(df) < 20:
        print("  ✗ 数据不足，跳过")
        return
    
    strategies = [
        ("趋势动量", MomentumStrategy()),
        ("价值成长", ValueStrategy()),
        ("技术突破", BreakoutStrategy())
    ]
    
    for name, strategy in strategies:
        try:
            score = strategy.calculate_score(df)
            results = strategy.select_stocks(df)
            print(f"  {name}: 得分 {score:.1f}")
        except Exception as e:
            print(f"  {name}: 错误 - {e}")

def test_database():
    print("\n[4/5] 测试数据库...")
    init_db()
    print("  ✓ 数据库初始化成功")

def main():
    init_db()
    
    df = test_data_source()
    if df is not None and not df.empty:
        df_with_ind = test_technical_indicators(df)
        if df_with_ind is not None:
            test_strategies(df_with_ind)
    test_database()
    
    print("\n" + "=" * 60)
    print("   测试完成！")
    print("   运行 'python main.py' 查看完整功能")
    print("   运行 'python -m web.app' 启动Web服务器")
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n✗ 测试出错: {e}")
        import traceback
        traceback.print_exc()
