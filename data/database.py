import os
from sqlalchemy import create_engine, Column, String, Float, Integer, Date, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config.settings import DATABASE_URL, DATA_DIR

DATA_DIR.mkdir(exist_ok=True)

Base = declarative_base()

class StockInfo(Base):
    __tablename__ = "stock_info"
    stock_code = Column(String(10), primary_key=True)
    stock_name = Column(String(50))
    industry = Column(String(50))
    market = Column(String(10))
    list_date = Column(Date)
    update_time = Column(DateTime, default=datetime.now)

class DailyQuote(Base):
    __tablename__ = "daily_quote"
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_code = Column(String(10))
    trade_date = Column(Date)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Float)
    amount = Column(Float)
    change_pct = Column(Float)
    pe = Column(Float)
    pb = Column(Float)
    market_cap = Column(Float)
    __table_args__ = ({"sqlite_autoincrement": True},)

class FinancialData(Base):
    __tablename__ = "financial_data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_code = Column(String(10))
    report_date = Column(Date)
    revenue = Column(Float)
    profit = Column(Float)
    revenue_growth = Column(Float)
    profit_growth = Column(Float)
    roe = Column(Float)
    update_time = Column(DateTime, default=datetime.now)
    __table_args__ = ({"sqlite_autoincrement": True},)

class StrategyRecord(Base):
    __tablename__ = "strategy_record"
    id = Column(Integer, primary_key=True, autoincrement=True)
    strategy_name = Column(String(50))
    trade_date = Column(Date)
    stock_code = Column(String(10))
    stock_name = Column(String(50))
    signal = Column(String(10))
    score = Column(Float)
    create_time = Column(DateTime, default=datetime.now)

class Recommendation(Base):
    __tablename__ = "recommendation"
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date)
    stock_code = Column(String(10))
    stock_name = Column(String(50))
    score = Column(Float)
    signal = Column(String(20))
    reasons = Column(Text)
    risk_level = Column(String(20))
    target_price = Column(Float)
    stop_loss = Column(Float)
    position_ratio = Column(Float)
    create_time = Column(DateTime, default=datetime.now)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(engine)

def get_db_session():
    return SessionLocal()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
