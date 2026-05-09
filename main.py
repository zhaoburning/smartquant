#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from data.database import init_db
from data.cache import DataManager
from recommendation.generator import RecommendationGenerator
from strategies.base_strategy import MomentumStrategy
from analysis.backtest import BacktestEngine
from trading.simulator import TradingAccount, TradingEngine
from data.data_source import DataSource
import logging

logging.basicConfig(
    level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    print("=" * 60)
    print("   SmartQuant - A股智能量化交易系统")
    print("=" * 60)
    
    print("\n[1/4] 初始化数据库...")
    init_db()
    print("✓ 数据库初始化完成")
    
    print("\n[2/4] 更新股票列表...")
    data_manager = DataManager()
    data_manager.update_stock_list()
    print("✓ 股票列表更新完成")
    
    print("\n[3/4] 生成今日推荐...")
    recommender = RecommendationGenerator()
    recommendations = recommender.generate_daily_recommendations(limit=5)
    
    if recommendations:
        print(f"\n今日推荐 ({len(recommendations)} 只股票:")
        print("-" * 60)
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['stock_name']} ({rec['stock_code']})")
            print(f"   评分: {rec['score']:.1f} | 信号: {rec['signal']} | 风险: {rec['risk_level']}")
            print(f"   目标价: {rec['target_price']} | 止损价: {rec['stop_loss']}")
            if rec['reasons']:
                reasons = rec['reasons'][:2]
                print("   理由: {}".format(', '.join(reasons)))
            print("-" * 60)
    else:
        print("暂无推荐股票")
    
    print("\n[4/4] 模拟交易账户初始化...")
    account = TradingAccount()
    summary = account.get_position_summary()
    print(f"✓ 初始资金: ¥{summary['total_value']:,.2f}")
    
    print("\n" + "=" * 60)
    print("   系统就绪！")
    print("=" * 60)
    print("   启动Web服务器请运行: python -m web.app")
    print("   或者查看帮助请运行: python -m scheduler.jobs")
    print("=" * 60)

def run_backtest_demo():
    print("\n运行回测演示...")
    data_source = DataSource()
    stock_code = "600000"
    df = data_source.get_historical_data(stock_code, days=300)
    
    if not df.empty:
        strategy = MomentumStrategy()
        engine = BacktestEngine()
        data_dict = {stock_code: df}
        metrics = engine.run(data_dict, strategy)
        
        print(f"\n回测结果 ({stock_code}):")
        print(f"总收益率: {metrics.total_return*100:.2f}%")
        print(f"年化收益率: {metrics.annual_return*100:.2f}%")
        print(f"最大回撤: {metrics.max_drawdown*100:.2f}%")
        print(f"夏普比率: {metrics.sharpe_ratio:.2f}")
        print(f"胜率: {metrics.win_rate*100:.2f}%")
        print(f"总交易次数: {metrics.total_trades}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "backtest":
        run_backtest_demo()
    else:
        main()
