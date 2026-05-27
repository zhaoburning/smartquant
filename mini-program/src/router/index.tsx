import { useEffect, useState } from 'react'
import { useLocation } from '@tarojs/taro'
import Dashboard from '@/pages/dashboard'
import Recommendations from '@/pages/recommendations'
import Portfolio from '@/pages/portfolio'
import Analysis from '@/pages/analysis'

export function useAppRouter() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState<string>('dashboard')

  useEffect(() => {
    const path = location.pathname
    if (path.includes('recommendations')) {
      setCurrentPage('recommendations')
    } else if (path.includes('portfolio')) {
      setCurrentPage('portfolio')
    } else if (path.includes('analysis')) {
      setCurrentPage('analysis')
    } else {
      setCurrentPage('dashboard')
    }
  }, [location.pathname])

  switch (currentPage) {
    case 'recommendations':
      return <Recommendations />
    case 'portfolio':
      return <Portfolio />
    case 'analysis':
      return <Analysis />
    default:
      return <Dashboard />
  }
}
