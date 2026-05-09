import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  StockOutlined,
  WalletOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import Recommendations from './pages/Recommendations'
import Portfolio from './pages/Portfolio'
import Analysis from './pages/Analysis'
import './App.css'

const { Sider, Content } = Layout

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '数据看板', path: '/' },
  { key: 'recommendations', icon: <StockOutlined />, label: '智能推荐', path: '/recommendations' },
  { key: 'portfolio', icon: <WalletOutlined />, label: '持仓管理', path: '/portfolio' },
  { key: 'analysis', icon: <BarChartOutlined />, label: '策略分析', path: '/analysis' }
]

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentKey = menuItems.find(item => item.path === location.pathname)?.key || 'dashboard'

  return (
    <Layout className="app-layout">
      <Sider 
        width={240}
        className="app-sider"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="brand">
          <div className="brand-icon">📊</div>
          <div className="brand-text">
            <span className="brand-name">SmartQuant</span>
            <span className="brand-tagline">智能量化交易</span>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          onClick={({ key }) => {
            const item = menuItems.find(m => m.key === key)
            if (item) navigate(item.path)
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
          className="app-menu"
        />
        
        <div className="sider-footer">
          <div className="market-status">
            <span className="status-dot" />
            <span>实时行情</span>
          </div>
        </div>
      </Sider>
      
      <Layout className="main-layout">
        <Content className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
