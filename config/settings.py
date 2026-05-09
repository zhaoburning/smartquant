import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "smartquant.db"
LOG_DIR = BASE_DIR / "logs"

INITIAL_CAPITAL = 1000000.0
RISK_SETTINGS = {
    "max_position_ratio": 0.2,
    "max_total_position": 0.8,
    "stop_loss_percent": 0.08,
    "max_daily_loss": 0.05,
    "max_holding_days": 20
}

DATABASE_URL = f"sqlite:///{DB_PATH}"

STRATEGY_PARAMS = {
    "momentum": {
        "ma_short": 20,
        "ma_long": 60,
        "min_gain": 0.05,
        "volume_ratio": 1.5,
        "min_cap": 5000000000,
        "max_cap": 50000000000
    },
    "value": {
        "min_pe": 15,
        "max_pe": 30,
        "max_pb": 3,
        "min_profit_growth": 0.15,
        "min_revenue_growth": 0.1
    },
    "breakout": {
        "breakout_days": 20,
        "volume_multiplier": 2,
        "min_gain": 0.03,
        "max_gain": 0.08,
        "max_rsi": 70,
        "max_cap": 10000000000
    }
}
