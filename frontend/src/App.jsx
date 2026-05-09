import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  StockOutlined,
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import Recommendations from './pages/Recommendations'
import Portfolio from './pages/Portfolio'
import Analysis from './pages/Analysis'
import './App.css'

const { Header, Sider, Content } = Layout

function App() {
  const [selectedKey, setSelectedKey] = React.useState('dashboard')

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '数据看板',
      path: '/'
    },
    {
      key: 'recommendations',
      icon: <StockOutlined />,
      label: '智能推荐',
      path: '/recommendations'
    },
    {
      key: 'portfolio',
      icon: <WalletOutlined />,
      label: '持仓管理',
      path: '/portfolio'
    },
    {
      key: 'analysis',
      icon: <BarChartOutlined />,
      label: '策略分析',
      path: '/analysis'
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={200}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          📊 SmartQuant
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            {menuItems.find(item => item.key === selectedKey)?.label}
          </h2>
          <div>
            <span style={{ color: '#666' }}>欢迎使用智能量化交易系统</span>
          </div>
        </Header>
        <Content style={{ margin: '24px', overflow: 'auto' }}>
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
