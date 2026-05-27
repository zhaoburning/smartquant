import { defineComponentApp } from '@tarojs/taro'

export default defineComponentApp({
  pages: [
    'pages/dashboard/index',
    'pages/recommendations/index',
    'pages/portfolio/index',
    'pages/analysis/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E40AF',
    navigationBarTitleText: 'SmartQuant',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F3F4F6'
  },
  tabBar: {
    color: '#6B7280',
    selectedColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/dashboard/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/recommendations/index',
        text: '推荐',
        iconPath: 'assets/icons/recommend.png',
        selectedIconPath: 'assets/icons/recommend-active.png'
      },
      {
        pagePath: 'pages/portfolio/index',
        text: '持仓',
        iconPath: 'assets/icons/portfolio.png',
        selectedIconPath: 'assets/icons/portfolio-active.png'
      },
      {
        pagePath: 'pages/analysis/index',
        text: '分析',
        iconPath: 'assets/icons/analysis.png',
        selectedIconPath: 'assets/icons/analysis-active.png'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '用于获取您的位置信息以提供更好的服务'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
