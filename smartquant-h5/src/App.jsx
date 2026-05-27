import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Recommendations from './pages/Recommendations'
import Portfolio from './pages/Portfolio'
import Analysis from './pages/Analysis'
import './App.css'

function App() {
  const location = useLocation()

  const tabs = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/recommendations', label: '推荐', icon: '📈' },
    { path: '/portfolio', label: '持仓', icon: '💼' },
    { path: '/analysis', label: '分析', icon: '📊' }
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">SmartQuant</span>
        </div>
        <span className="subtitle">智能量化交易</span>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </main>

      <nav className="tab-bar">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default App
