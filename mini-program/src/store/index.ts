import { create } from 'zustand'

interface Position {
  stock_code: string
  stock_name: string
  shares: number
  avg_price: number
  current_price: number
  profit: number
  profit_pct: number
}

interface Stats {
  total_profit: number
  total_profit_pct: number
  win_rate: number
  total_trades: number
}

interface AccountData {
  total_value: number
  cash: number
  positions: Position[]
  stats: Stats
}

interface StockItem {
  stock_code: string
  stock_name: string
  score: number
  signal: string
  risk_level: string
  current_price: number
  target_price: number
  stop_loss: number
  position_ratio: number
  reasons: string[]
}

interface AppState {
  accountData: AccountData | null
  recommendations: StockItem[]
  setAccountData: (data: AccountData) => void
  setRecommendations: (data: StockItem[]) => void
  addPosition: (position: Position) => void
  removePosition: (stockCode: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  accountData: null,
  recommendations: [],
  setAccountData: (data) => set({ accountData: data }),
  setRecommendations: (data) => set({ recommendations: data }),
  addPosition: (position) =>
    set((state) => {
      if (!state.accountData) return state
      const exists = state.accountData.positions.some(
        (p) => p.stock_code === position.stock_code
      )
      if (exists) {
        return {
          accountData: {
            ...state.accountData,
            positions: state.accountData.positions.map((p) =>
              p.stock_code === position.stock_code ? position : p
            ),
          },
        }
      }
      return {
        accountData: {
          ...state.accountData,
          positions: [...state.accountData.positions, position],
        },
      }
    }),
  removePosition: (stockCode) =>
    set((state) => {
      if (!state.accountData) return state
      return {
        accountData: {
          ...state.accountData,
          positions: state.accountData.positions.filter(
            (p) => p.stock_code !== stockCode
          ),
        },
      }
    }),
}))
