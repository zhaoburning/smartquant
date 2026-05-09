import axios from 'axios'

const USE_MOCK = true
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const mockApi = {
  health: () => Promise.resolve({ data: { status: 'ok', message: 'Mock API' } }),
  getRecommendations: () => Promise.resolve({
    data: {
      success: true,
      data: [
        { stock_code: '600519', stock_name: '贵州茅台', score: 85, signal: '强烈推荐', risk_level: '低风险', current_price: 1850, target_price: 2127, stop_loss: 1702, position_ratio: 0.15, reasons: ['技术面看好', '趋势明确'] },
        { stock_code: '000858', stock_name: '五粮液', score: 78, signal: '推荐', risk_level: '低风险', current_price: 145, target_price: 166, stop_loss: 133, position_ratio: 0.12, reasons: ['业绩增长', '机构持仓'] },
        { stock_code: '600036', stock_name: '招商银行', score: 75, signal: '推荐', risk_level: '中风险', current_price: 38, target_price: 43, stop_loss: 35, position_ratio: 0.10, reasons: ['估值修复', '资产质量改善'] },
        { stock_code: '601318', stock_name: '中国平安', score: 72, signal: '推荐', risk_level: '中风险', current_price: 52, target_price: 59, stop_loss: 47, position_ratio: 0.08, reasons: ['估值合理', '行业龙头'] },
        { stock_code: '000001', stock_name: '平安银行', score: 68, signal: '观望', risk_level: '中风险', current_price: 12.5, target_price: 14, stop_loss: 11.5, position_ratio: 0.05, reasons: ['等待突破'] },
      ]
    }
  }),
  getAccount: () => Promise.resolve({
    data: {
      success: true,
      data: { total_value: 100000, cash: 50000, positions: [] }
    }
  }),
  getTradeHistory: () => Promise.resolve({ data: { success: true, data: [] } }),
  getStrategies: () => Promise.resolve({
    data: {
      success: true,
      data: [
        { name: 'momentum', description: '趋势动量策略', enabled: true },
        { name: 'value', description: '价值成长策略', enabled: true },
        { name: 'breakout', description: '技术突破策略', enabled: true }
      ]
    }
  }),
  getStockInfo: (stockCode) => {
    const mockStocks = {
      '600519': { name: '贵州茅台', price: 1800, trend: 'up' },
      '000858': { name: '五粮液', price: 140, trend: 'up' },
      '601318': { name: '中国平安', price: 50, trend: 'down' },
      '000001': { name: '平安银行', price: 12, trend: 'side' },
      '600036': { name: '招商银行', price: 35, trend: 'up' },
    }
    const stock = mockStocks[stockCode] || mockStocks['600519']
    const history = []
    let price = stock.price
    for (let i = 60; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      price = price * (1 + (Math.random() - 0.5) * 0.04)
      history.push({
        trade_date: date.toISOString().split('T')[0],
        open_price: price,
        close_price: price * (1 + (Math.random() - 0.5) * 0.02),
        high_price: price * 1.01,
        low_price: price * 0.99,
        volume: Math.floor(Math.random() * 4000000) + 1000000,
        amount: price * Math.floor(Math.random() * 4000000)
      })
    }
    return Promise.resolve({
      data: {
        success: true,
        data: {
          quote: { stock_code: stockCode, stock_name: stock.name, close_price: price, open_price: price, high_price: price * 1.02, low_price: price * 0.98, volume: 3000000, change_pct: 1.5 },
          history: history,
          source: 'mock'
        }
      }
    })
  },
  buyStock: (data) => Promise.resolve({ data: { success: true, message: `买入成功: ${data.stock_name} ${data.shares}股` } }),
  sellStock: (data) => Promise.resolve({ data: { success: true, message: '卖出成功' } }),
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
