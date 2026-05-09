from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import json

app = Flask(__name__)
CORS(app)

app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

def generate_mock_stock_data(stock_code):
    mock_stocks = {
        "600519": {"name": "贵州茅台", "price": 1800.0, "trend": "up"},
        "000858": {"name": "五粮液", "price": 140.0, "trend": "up"},
        "601318": {"name": "中国平安", "price": 50.0, "trend": "down"},
        "000001": {"name": "平安银行", "price": 12.0, "trend": "side"},
        "600036": {"name": "招商银行", "price": 35.0, "trend": "up"},
    }
    
    if stock_code not in mock_stocks:
        stock_code = "600519"
    
    stock = mock_stocks[stock_code]
    days = 60
    dates = [datetime.now() - timedelta(days=i) for i in range(days)]
    dates.reverse()
    
    prices = [stock["price"]]
    for _ in range(1, days):
        change = prices[-1] * np.random.normal(0, 0.02)
        prices.append(max(prices[-1] + change, stock["price"] * 0.8))
    
    if stock["trend"] == "up":
        prices = [p * (1 + i * 0.003) for i, p in enumerate(prices)]
    elif stock["trend"] == "down":
        prices = [p * (1 - i * 0.002) for i, p in enumerate(prices)]
    
    df = pd.DataFrame({
        "trade_date": [d.date().isoformat() for d in dates],
        "open_price": prices,
        "close_price": prices,
        "high_price": [p * (1 + np.random.uniform(0, 0.02)) for p in prices],
        "low_price": [p * (1 - np.random.uniform(0, 0.02)) for p in prices],
        "volume": [int(np.random.randint(1000000, 5000000)) for _ in range(days)],
        "amount": [float(p * np.random.randint(1000000, 5000000)) for p in prices]
    })
    df = df.astype({
        "open_price": float,
        "close_price": float,
        "high_price": float,
        "low_price": float,
        "volume": int,
        "amount": float
    })
    return stock["name"], df

def get_mock_recommendations():
    mock_stocks = [
        {"code": "600519", "name": "贵州茅台", "price": 1850.0, "score": 85, "signal": "强烈推荐", "risk": "低风险"},
        {"code": "000858", "name": "五粮液", "price": 145.0, "score": 78, "signal": "推荐", "risk": "低风险"},
        {"code": "600036", "name": "招商银行", "price": 38.0, "score": 75, "signal": "推荐", "risk": "中风险"},
        {"code": "601318", "name": "中国平安", "price": 52.0, "score": 72, "signal": "推荐", "risk": "中风险"},
        {"code": "000001", "name": "平安银行", "price": 12.5, "score": 68, "signal": "观望", "risk": "中风险"},
    ]
    
    recommendations = []
    for stock in mock_stocks:
        recommendations.append({
            "stock_code": stock["code"],
            "stock_name": stock["name"],
            "score": stock["score"],
            "signal": stock["signal"],
            "risk_level": stock["risk"],
            "current_price": stock["price"],
            "target_price": round(stock["price"] * 1.15, 2),
            "stop_loss": round(stock["price"] * 0.92, 2),
            "position_ratio": 0.15,
            "reasons": ["技术面看好", "趋势明确"]
        })
    return recommendations

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "SmartQuant API is running"})

@app.route("/api/recommendations")
def get_recommendations():
    return jsonify({
        "success": True,
        "data": get_mock_recommendations(),
        "source": "mock"
    })

@app.route("/api/account")
def get_account():
    return jsonify({
        "success": True,
        "data": {
            "total_value": 100000.0,
            "cash": 50000.0,
            "positions": []
        }
    })

@app.route("/api/account/trades")
def get_trade_history():
    return jsonify({
        "success": True,
        "data": []
    })

@app.route("/api/strategies")
def get_strategies():
    strategies = [
        {"name": "momentum", "description": "趋势动量策略", "enabled": True},
        {"name": "value", "description": "价值成长策略", "enabled": True},
        {"name": "breakout", "description": "技术突破策略", "enabled": True}
    ]
    return jsonify({
        "success": True,
        "data": strategies
    })

def df_to_serializable(df):
    result = []
    for _, row in df.iterrows():
        record = {}
        for key, value in row.items():
            if hasattr(value, 'item'):
                record[key] = value.item()
            else:
                record[key] = value
        result.append(record)
    return result

@app.route("/api/stock/<stock_code>")
def get_stock_info(stock_code):
    stock_name, df = generate_mock_stock_data(stock_code)
    quote = {
        "stock_code": stock_code,
        "stock_name": stock_name,
        "close_price": float(df.iloc[-1]["close_price"]),
        "open_price": float(df.iloc[-1]["open_price"]),
        "high_price": float(df.iloc[-1]["high_price"]),
        "low_price": float(df.iloc[-1]["low_price"]),
        "volume": int(df.iloc[-1]["volume"]),
        "change_pct": float(np.random.uniform(-3, 3))
    }
    return jsonify({
        "success": True,
        "data": {
            "quote": quote,
            "history": df_to_serializable(df),
            "source": "mock"
        }
    })

@app.route("/api/trade/buy", methods=["POST"])
def trade_buy():
    from flask import request
    data = request.get_json()
    return jsonify({
        "success": True,
        "message": f"买入成功"
    })

@app.route("/api/trade/sell", methods=["POST"])
def trade_sell():
    from flask import request
    data = request.get_json()
    return jsonify({
        "success": True,
        "message": f"卖出成功"
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
