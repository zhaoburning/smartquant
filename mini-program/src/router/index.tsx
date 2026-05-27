import { ComponentType } from 'react'
import { Router, useRouter } from '@tarojs/taro'
import Dashboard from '@/pages/dashboard'
import Recommendations from '@/pages/recommendations'
import Portfolio from '@/pages/portfolio'
import Analysis from '@/pages/analysis'

interface RouteConfig {
  path: string
  component?: ComponentType
  name?: string
}

const routes: RouteConfig[] = [
  { path: '/pages/dashboard/index', component: Dashboard, name: 'Dashboard' },
  { path: '/pages/recommendations/index', component: Recommendations, name: 'Recommendations' },
  { path: '/pages/portfolio/index', component: Portfolio, name: 'Portfolio' },
  { path: '/pages/analysis/index', component: Analysis, name: 'Analysis' }
]

export const useAppRouter = () => {
  const router = useRouter()
  const currentPath = router.path

  const currentRoute = routes.find(route => route.path === currentPath)
  const CurrentComponent = currentRoute?.component

  return CurrentComponent ? <CurrentComponent /> : <Dashboard />
}

export { routes }
export default Router
