import axios from 'axios'

const USE_MOCK = true
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const mockApi = {
  health: () => Promise.resolve({ data: { status: 'ok', message: 'SmartQuant API is running' } }),
  
  getRecommendations: () => Promise.resolve({
    data: {
      success: true,
      source: 'mock',
      data: [
        {
          stock_code: '600519', stock_name: '贵州茅台', score: 92, signal: '强烈推荐', risk_level: '低风险',
          current_price: 1685.00, target_price: 1850, stop_loss: 1580, position_ratio: 0.20,
          reasons: ['行业龙头', '业绩稳定', '机构持仓', '估值修复']
        },
        {
          stock_code: '000858', stock_name: '五粮液', score: 88, signal: '强烈推荐', risk_level: '低风险',
          current_price: 142.50, target_price: 158, stop_loss: 132, position_ratio: 0.15,
          reasons: ['品牌优势', '消费升级', '渠道优化']
        },
        {
          stock_code: '600036', stock_name: '招商银行', score: 85, signal: '推荐', risk_level: '中风险',
          current_price: 36.80, target_price: 41, stop_loss: 33.5, position_ratio: 0.12,
          reasons: ['资产质量优', '零售业务强', '估值合理']
        },
        {
          stock_code: '601318', stock_name: '中国平安', score: 82, signal: '推荐', risk_level: '中风险',
          current_price: 48.20, target_price: 54, stop_loss: 44, position_ratio: 0.10,
          reasons: ['综合金融', '科技赋能', '业绩增长']
        },
        {
          stock_code: '000001', stock_name: '平安银行', score: 78, signal: '推荐', risk_level: '中风险',
          current_price: 11.35, target_price: 12.8, stop_loss: 10.2, position_ratio: 0.08,
          reasons: ['零售转型', '资产质量改善', '估值较低']
        },
        {
          stock_code: '600887', stock_name: '伊利股份', score: 76, signal: '推荐', risk_level: '低风险',
          current_price: 27.60, target_price: 31, stop_loss: 25, position_ratio: 0.10,
          reasons: ['乳业龙头', '稳定分红', '消费刚需']
        },
        {
          stock_code: '601888', stock_name: '中国中免', score: 74, signal: '推荐', risk_level: '中风险',
          current_price: 68.50, target_price: 78, stop_loss: 62, position_ratio: 0.08,
          reasons: ['免税龙头', '政策利好', '消费回流']
        },
        {
          stock_code: '300750', stock_name: '宁德时代', score: 80, signal: '推荐', risk_level: '高风险',
          current_price: 198.00, target_price: 230, stop_loss: 175, position_ratio: 0.06,
          reasons: ['全球领先', '技术优势', '市场份额']
        }
      ]
    }
  }),
  
  getAccount: () => Promise.resolve({
    data: {
      success: true,
      data: {
        total_value: 125680.50,
        cash: 45680.50,
        positions: [
          { stock_code: '600519', stock_name: '贵州茅台', shares: 10, avg_price: 1650, current_price: 1685, profit: 350, profit_pct: 2.12 },
          { stock_code: '600036', stock_name: '招商银行', shares: 500, avg_price: 35.2, current_price: 36.8, profit: 800, profit_pct: 4.55 },
          { stock_code: '000858', stock_name: '五粮液', shares: 200, avg_price: 138, current_price: 142.5, profit: 900, profit_pct: 3.26 }
        ],
        stats: {
          total_profit: 2850.00,
          total_profit_pct: 2.32,
          win_rate: 75.5,
          total_trades: 28
        }
      }
    }
  }),
  
  getTradeHistory: () => Promise.resolve({
    data: {
      success: true,
      data: [
        { id: 1, date: '2024-01-15', action: '买入', stock_code: '600519', stock_name: '贵州茅台', price: 1650, shares: 10, amount: 16500 },
        { id: 2, date: '2024-01-18', action: '买入', stock_code: '600036', stock_name: '招商银行', price: 35.2, shares: 500, amount: 17600 },
        { id: 3, date: '2024-01-20', action: '买入', stock_code: '000858', stock_name: '五粮液', price: 138, shares: 200, amount: 27600 },
        { id: 4, date: '2024-01-22', action: '卖出', stock_code: '601318', stock_name: '中国平安', price: 49.5, shares: 300, amount: 14850, profit: 450 },
        { id: 5, date: '2024-01-25', action: '买入', stock_code: '600887', stock_name: '伊利股份', price: 26.8, shares: 400, amount: 10720 }
      ]
    }
  }),
  
  getStrategies: () => Promise.resolve({
    data: {
      success: true,
      data: [
        { name: 'momentum', description: '趋势动量策略', enabled: true, return: 15.8, trades: 45 },
        { name: 'value', description: '价值成长策略', enabled: true, return: 12.3, trades: 28 },
        { name: 'breakout', description: '技术突破策略', enabled: false, return: 8.5, trades: 62 }
      ]
    }
  }),
  
  getStockInfo: (stockCode) => {
    const mockStocks = {
      '600519': { name: '贵州茅台', price: 1685, trend: 'up' },
      '000858': { name: '五粮液', price: 142.5, trend: 'up' },
      '601318': { name: '中国平安', price: 48.2, trend: 'down' },
      '000001': { name: '平安银行', price: 11.35, trend: 'side' },
      '600036': { name: '招商银行', price: 36.8, trend: 'up' },
      '600887': { name: '伊利股份', price: 27.6, trend: 'up' },
      '601888': { name: '中国中免', price: 68.5, trend: 'down' },
      '300750': { name: '宁德时代', price: 198, trend: 'side' }
    }
    
    const stock = mockStocks[stockCode] || mockStocks['600519']
    const history = []
    let price = stock.price * 0.85
    
    for (let i = 60; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const trend = stock.trend === 'up' ? 0.003 : stock.trend === 'down' ? -0.002 : 0
      price = price * (1 + trend + (Math.random() - 0.5) * 0.03)
      
      const open = price * (1 + (Math.random() - 0.5) * 0.02)
      const close = price * (1 + (Math.random() - 0.5) * 0.02)
      const high = Math.max(open, close) * (1 + Math.random() * 0.015)
      const low = Math.min(open, close) * (1 - Math.random() * 0.015)
      
      history.push({
        trade_date: date.toISOString().split('T')[0],
        open_price: parseFloat(open.toFixed(2)),
        close_price: parseFloat(close.toFixed(2)),
        high_price: parseFloat(high.toFixed(2)),
        low_price: parseFloat(low.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        amount: parseFloat((price * Math.floor(Math.random() * 4000000 + 1000000)).toFixed(2))
      })
    }
    
    const currentPrice = history[history.length - 1].close_price
    const prevPrice = history[history.length - 2].close_price
    const changePct = ((currentPrice - prevPrice) / prevPrice * 100).toFixed(2)
    
    return Promise.resolve({
      data: {
        success: true,
        data: {
          quote: {
            stock_code: stockCode,
            stock_name: stock.name,
            close_price: currentPrice,
            open_price: history[history.length - 1].open_price,
            high_price: history[history.length - 1].high_price,
            low_price: history[history.length - 1].low_price,
            volume: history[history.length - 1].volume,
            change_pct: parseFloat(changePct)
          },
          history: history,
          source: 'mock'
        }
      }
    })
  },
  
  buyStock: (data) => Promise.resolve({
    data: {
      success: true,
      message: `买入成功！${data.stock_name} ${data.shares}股 @ ¥${data.price}`
    }
  }),
  
  sellStock: (data) => Promise.resolve({
    data: {
      success: true,
      message: `卖出成功！${data.stock_name} ${data.shares}股 @ ¥${data.price}`
    }
  })
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
})

export const healthCheck = USE_MOCK ? mockApi.health : () => api.get('/health')
export const getRecommendations = USE_MOCK ? mockApi.getRecommendations : () => api.get('/recommendations')
export const generateRecommendations = () => api.post('/recommendations/generate')
export const getAccount = USE_MOCK ? mockApi.getAccount : () => api.get('/account')
export const getTradeHistory = USE_MOCK ? mockApi.getTradeHistory : () => api.get('/account/trades')
export const getStockInfo = USE_MOCK ? mockApi.getStockInfo : (stockCode) => api.get(`/stock/${stockCode}`)
export const buyStock = USE_MOCK ? mockApi.buyStock : (data) => api.post('/trade/buy', data)
export const sellStock = USE_MOCK ? mockApi.sellStock : (data) => api.post('/trade/sell', data)
export const getStrategies = USE_MOCK ? mockApi.getStrategies : () => api.get('/strategies')

export default api
