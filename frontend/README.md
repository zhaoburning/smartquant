# SmartQuant 前端项目

## 技术栈

- React 18
- Vite (构建工具)
- Ant Design (UI组件库)
- ECharts (数据可视化)
- Axios (HTTP请求)
- React Router (路由)

## 项目结构

```
frontend/
├── src/
│   ├── api/
│   │   └── index.js          # API接口封装
│   ├── pages/
│   │   ├── Dashboard.jsx     # 数据看板页
│   │   ├── Recommendations.jsx # 智能推荐页
│   │   ├── Portfolio.jsx     # 持仓管理页
│   │   └── Analysis.jsx      # 策略分析页
│   ├── App.jsx               # 主应用组件
│   ├── App.css               # 样式文件
│   ├── main.jsx              # 入口文件
│   └── index.css             # 全局样式
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 功能模块

### 1. 数据看板 (Dashboard)
- 总资产、总收益、收益率、持仓数量统计
- 资产走势折线图
- 持仓分布饼图
- 今日推荐股票展示

### 2. 智能推荐 (Recommendations)
- 推荐股票列表展示
- 一键生成推荐
- 买入功能

### 3. 持仓管理 (Portfolio)
- 持仓股票展示
- 盈亏统计
- 卖出功能
- 交易历史

### 4. 策略分析 (Analysis)
- 策略信息展示
- 策略收益对比图
- 股票K线图

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## API代理配置

Vite已配置代理，将 `/api` 请求转发到后端服务：
- 开发环境：http://localhost:5001

## 后端服务

请确保后端服务已启动：
```bash
# 在项目根目录下
python -m web.app
```

后端服务运行在 http://localhost:5001

## 注意事项

- 本项目仅供学习和研究使用
- 不构成任何投资建议
- 股市有风险，投资需谨慎
