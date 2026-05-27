import { defineConfig } from '@tarojs/cli'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const isDEV = process.env.NODE_ENV === 'development'

export default defineConfig({
  appType: 'react',
  presets: [
    ['taroPreset', {}]
  ],
  projectName: 'smartquant',
  date: new Date().getTime(),
  designWidth: 375,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
    '375': 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    ['@tarojs/plugin-framework-react']
  ],
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  cacheDirectory: '.taro-cache',
  defineConstants: {},
  mini: {
    compile: {
      include: [require.resolve('nutui-react-taro')]
    },
    cssLoaderOption: {},
    imageUrlLoaderOption: {},
    modifyWebpackChain(options) {
      if (isDEV) {
        options.plugins.delete('mini-css-extract-plugin')
        options.plugins.append('react-refresh-webpack-plugin', new ReactRefreshPlugin({
          library: { entry: 'react' },
          exclude: [/node_modules/]
        }))
      }
    },
    miniWebpackChain(options) {},
    postcss: {
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'global',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    router: {
      mode: 'hash',
      customRoutes: {}
    },
    publicPath: '/',
    staticDirectory: 'static',
    cssLoaderOption: {},
    miniCssExtractPluginOption: {
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    },
    postcss: {
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      }
    },
    webpackChain(chain) {
      chain.resolve.alias.set('@', path.resolve(__dirname, '../src'))
    }
  }
})
