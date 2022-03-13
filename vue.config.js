const path = require('path')
const defaultSettings = require('./src/defaultSettings.js')
const TerserPlugin = require('terser-webpack-plugin')
const chalk = require('chalk')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 主环境
const nodeEnv = process.env.NODE_ENV
// 分支环境
const branchEnv = process.env.VUE_APP_BRANCH_ENV
// 项目名称
const appName = defaultSettings.appTitle
// 开发环境启动本地服务的端口号
const port = 3030

console.log(chalk.magentaBright(`\n > [项目环境]${nodeEnv}`))
console.log(chalk.yellow(`\n > [项目分支环境]${branchEnv}`))

// vue.config.js的主体配置
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'UEV',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      // 配置CDN地址
      cdn: {
        css: [],
        js: [
          // '//unpkg.com/axios@0.21.1/dist/axios.min.js',
          // '//unpkg.com/moment@2.29.1/moment.js',
          // '//unpkg.com/echarts@5.1.2/dist/echarts.js'
        ]
      }
    }
  },
  filenameHashing: true,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: nodeEnv === 'development' || branchEnv === 'test',
  // 配置生产环境基础地址，（例如：publicPath: '/abc/'，则项目的访问地址为：http://xxxx.xxxx.xxxx.xxxx:xxxx/abc/）
  publicPath: './',
  configureWebpack: config => {
    // 设置项目名称
    config.name = appName
    if (nodeEnv === 'production') {
      // 此处为正式生产环境配置
      // 启动最小化压缩
      config.optimization.minimize = true
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            mangle: true, // 混淆，默认也是开的，mangle也是可以配置很多选项的，具体看https://webpack.docschina.org/plugins/terser-webpack-plugin/
            ecma: undefined,
            warnings: false,
            parse: {},
            cache: true, // 是否缓存
            paraller: true, // 是否并行打包
            sourceMap: false,
            compress: {
              // 移除所有console相关的代码，比如console.log、console.error
              drop_console: branchEnv === 'production',
              // 关闭自动断点功能，vue代码里插入debugger指令后，执行到对应位置会自动断线，此选项是移除debugger指令
              drop_debugger: branchEnv === 'production',
              // pure_funcs数组是用来配置移除指定的指令，比如console.log  alert等等
              pure_funcs:
                branchEnv === 'production'
                  ? ['console.log', 'console.error', 'debugger']
                  : []
            }
          }
        })
      ]
    }

    Object.assign(config, {
      externals: {
        /**
         * 下面为设置CDN形式抽离出来的第三方插件
         */
        // 'moment': 'moment',
        // 'axios': 'axios',
        // 'echarts': 'echarts',
        BMap: 'BMap',
        BMapLib: 'BMapLib'
      }
    })
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@images', resolve('src/assets/images'))
      .set('@views', resolve('src/views'))
      .set('@gzcss', resolve('src/components/gzcss'))
    config.resolve.symlinks(true)
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader').end()
    // config.output.filename('chunk-[name].[hash:8].js').end()
  },
  // css方面的配置
  css: {
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)
    extract: nodeEnv === 'production',
    // 是否为 CSS 开启 source map
    sourceMap: nodeEnv !== 'production',
    // 样式预加载设置
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            /* less 变量覆盖，用于自定义 ant design 主题 */
            'primary-color': defaultSettings.primaryColor,
            // 默认按钮文本颜色
            'btn-default-color': defaultSettings.primaryColor,
            // 基础字体大小：
            'font-size-base': defaultSettings.boldFont ? '16px' : '14px',
            'font-size-sm': defaultSettings.boldFont ? '14px' : '12px',
            // 默认按钮背景色
            'btn-default-bg': '#ebf5ff',
            // 默认按钮边框颜色
            'btn-default-border': '#c2e0fe',
            // 表格hover行的背景色主题
            'table-row-hover-bg': '#fafafa',
            // 勾选中的表格行颜色
            'table-selected-row-bg': 'rgba(50, 150, 250, .1)'
          },
          javascriptEnabled: true
        }
      },
      // 给 sass-loader 传递选项
      sass: {
        implementation: require('sass'),
        // @/ 是 src/ 的别名
        prependData: `
          @import "@styles/helper/mixin.scss";
          @import "@styles/helper/variables.scss";
        `
      }
    }
  },
  // webpack-dev-server的配置
  // 配置本地服务器
  devServer: {
    hot: true,
    open: true,
    https: false,
    port,
    overlay: {
      warning: true,
      errors: true
    }
  }
}
