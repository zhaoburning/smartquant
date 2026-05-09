import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export const healthCheck = () => api.get('/health')
export const getRecommendations = () => api.get('/recommendations')
export const generateRecommendations = () => api.post('/recommendations/generate')
export const getAccount = () => api.get('/account')
export const getTradeHistory = () => api.get('/account/trades')
export const getStockInfo = (stockCode) => api.get(`/stock/${stockCode}`)
export const buyStock = (data) => api.post('/trade/buy', data)
export const sellStock = (data) => api.post('/trade/sell', data)
export const getStrategies = () => api.get('/strategies')

export default api
