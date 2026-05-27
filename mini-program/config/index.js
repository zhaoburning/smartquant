import { defineConfig } from '@tarojs/cli'

export default defineConfig({
  appType: 'react',
  framework: 'react',
  projectName: 'smartquant',
  date: '2024-01-01',
  designWidth: 375,
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    ['@tarojs/plugin-framework-react']
  ],
  cacheDirectory: '.taro-cache',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  mini: {},
  h5: {
    router: {
      mode: 'hash'
    },
    publicPath: '/',
    staticDirectory: 'static'
  }
})
