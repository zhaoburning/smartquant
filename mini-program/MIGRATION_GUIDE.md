# 小程序改造说明

## 改造概述

本次改造将原有的 React Web 应用转换为支持小程序的多端应用。主要使用了 **Taro** 框架，它可以将 React 代码编译为多个平台的小程序（微信、支付宝、抖音等）。

## 主要改造内容

### 1. 项目框架变更

**原项目**:
- Vite + React 18
- React Router DOM
- Ant Design 组件库
- ECharts 图表库

**改造后**:
- Taro 3.x + React 18
- Taro Router
- NutUI React 组件库（Taro 适配版本）
- 自定义 Canvas 图表组件

### 2. 核心文件改造

#### 入口文件改造

**原 `main.jsx`**:
```javascript
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App'
```

**新 `app.tsx`**:
```typescript
import { Component } from 'react'
import { useAppRouter } from '@/router'
import './app.scss'

class App extends Component {
  render() {
    return <useAppRouter />
  }
}
```

#### 路由系统改造

**原路由** (`react-router-dom`):
```javascript
import { Routes, Route } from 'react-router-dom'
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/recommendations" element={<Recommendations />} />
</Routes>
```

**新路由** (Taro TabBar):
```typescript
// app.config.ts
export default defineComponentApp({
  pages: [
    'pages/dashboard/index',
    'pages/recommendations/index',
    'pages/portfolio/index',
    'pages/analysis/index'
  ],
  tabBar: {
    list: [
      { pagePath: 'pages/dashboard/index', text: '首页' },
      { pagePath: 'pages/recommendations/index', text: '推荐' },
      { pagePath: 'pages/portfolio/index', text: '持仓' },
      { pagePath: 'pages/analysis/index', text: '分析' }
    ]
  }
})
```

#### 组件标签改造

**原标签** (HTML/Ant Design):
```jsx
<div className="container">
  <Layout>
    <Content>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Card>...</Card>
        </Col>
      </Row>
    </Content>
  </Layout>
</div>
```

**新标签** (Taro):
```tsx
<ScrollView className='container'>
  <View className='stats-grid'>
    <View className='stat-card'>
      ...
    </View>
  </View>
</ScrollView>
```

#### 状态管理

**原项目**: 使用组件内部 state + Context

**新项目**: 使用 Zustand（小程序兼容的状态管理库）

```typescript
// store/index.ts
import { create } from 'zustand'

export const useAppStore = create((set) => ({
  accountData: null,
  recommendations: [],
  setAccountData: (data) => set({ accountData: data }),
  setRecommendations: (data) => set({ recommendations: data }),
}))
```

#### 图表组件改造

**原项目**: 使用 `echarts-for-react` 组件

**新项目**: 使用 Canvas 自绘图表（适配小程序环境）

```tsx
// components/Charts/index.tsx
export function LineChart({ option, style }) {
  return (
    <View style={style}>
      <canvas ref={canvasRef} type='2d' />
    </View>
  )
}
```

### 3. 样式系统改造

**原项目**: 使用 CSS Modules 或普通 CSS

**新项目**: 使用 SCSS，保持响应式设计

```scss
// 小程序适配的样式
page {
  background-color: #F3F4F6;
  font-size: 28px;
}

.container {
  padding: 24px;
  box-sizing: border-box;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### 4. 适配要点

1. **标签名适配**:
   - `<div>` → `<View>`
   - `<span>` → `<Text>`
   - `<a>` → `<navigator>`
   - `<img>` → `<Image>`

2. **事件处理**:
   - `onClick` → `onTap`（部分组件使用 `onClick`）
   - `onChange` → 保持不变

3. **样式单位**:
   - 使用 `px` 作为设计单位（Taro 会自动转换）
   - 设计稿基于 375px 宽度

4. **路由跳转**:
   - `Link to="/path"` → `navigator url="/pages/path/index"`
   - `useNavigate()` → `Taro.navigateTo()` 或 `Taro.switchTab()`

5. **生命周期**:
   - `useEffect` → 保持不变
   - `componentDidMount` → `componentDidShow`

## 运行项目

### 安装依赖

```bash
cd mini-program
npm install
```

### 开发模式

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# H5（用于预览）
npm run dev:h5
```

### 构建生产版本

```bash
# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:alipay
```

## 注意事项

1. **首次运行**: 需要在对应的开发者工具中导入 `mini-program/dist` 目录
2. **图表组件**: 当前使用简化的 Canvas 实现，可根据需要扩展为完整的图表库
3. **API 调用**: 当前使用 Mock 数据，需要接入真实 API
4. **tabBar 图标**: 需要准备对应的图标文件放在 `assets/icons/` 目录

## 后续优化建议

1. 集成完整的图表库（如 F2）
2. 添加登录和用户系统
3. 实现真实的数据 API 对接
4. 添加性能监控和错误上报
5. 优化首屏加载速度
