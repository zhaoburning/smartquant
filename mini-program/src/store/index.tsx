import React, { createContext, useContext, useState, ReactNode } from 'react'

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

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [accountData, setAccountDataState] = useState<AccountData | null>(null)
  const [recommendations, setRecommendationsState] = useState<StockItem[]>([])

  const setAccountData = (data: AccountData) => {
    setAccountDataState(data)
  }

  const setRecommendations = (data: StockItem[]) => {
    setRecommendationsState(data)
  }

  const addPosition = (position: Position) => {
    setAccountDataState((prev) => {
      if (!prev) return prev
      const exists = prev.positions.some(
        (p) => p.stock_code === position.stock_code
      )
      if (exists) {
        return {
          ...prev,
          positions: prev.positions.map((p) =>
            p.stock_code === position.stock_code ? position : p
          ),
        }
      }
      return {
        ...prev,
        positions: [...prev.positions, position],
      }
    })
  }

  const removePosition = (stockCode: string) => {
    setAccountDataState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        positions: prev.positions.filter((p) => p.stock_code !== stockCode),
      }
    })
  }

  const value: AppState = {
    accountData,
    recommendations,
    setAccountData,
    setRecommendations,
    addPosition,
    removePosition,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore(): AppState {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
