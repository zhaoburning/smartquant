# SmartQuant Mini Program

智能量化交易小程序，基于 Taro 框架开发，支持多端编译（微信小程序、支付宝小程序、抖音小程序、H5）。

## 技术栈

- **框架**: Taro 3.x
- **UI 库**: NutUI React
- **状态管理**: Zustand
- **语言**: TypeScript
- **样式**: SCSS

## 快速开始

### 安装依赖

```bash
cd mini-program
npm install
```

### 开发

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# H5
npm run dev:h5
```

### 构建

```bash
# 微信小程序
npm run build:weapp

# 支付宝小程序
npm run build:alipay

# H5
npm run build:h5
```

## 项目结构

```
mini-program/
├── src/
│   ├── pages/              # 页面
│   │   ├── dashboard/     # 数据看板
│   │   ├── recommendations/ # 智能推荐
│   │   ├── portfolio/     # 持仓管理
│   │   └── analysis/      # 策略分析
│   ├── components/         # 组件
│   ├── store/             # 状态管理
│   └── router/            # 路由配置
├── config/                # 配置文件
└── package.json
```

## 功能特性

1. **数据看板**: 实时监控账户表现与市场动态
2. **智能推荐**: 基于多维度分析的投资建议
3. **持仓管理**: 管理投资组合，支持加仓/减仓
4. **策略分析**: 量化策略表现与回测分析

## 注意事项

- 首次使用需在微信开发者工具中导入项目
- 编译产物在 `dist/` 目录
- 图表组件使用 Canvas 实现，支持小程序环境
