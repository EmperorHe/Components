import App from '@/App.vue'
import '@/assets/iconFonts/iconfont.css' // 加载字体图标库
import '@/assets/styles/index.scss' // 全局公共样式
import '@/assets/styles/theme.less'
// 全局引入gzcss和uev项目公共组件，不用在每个组件中重复使用import引入gzcss的组件
import gzcss from '@/components/gzcss'
import uev from '@/components/uev'
// 配置项目主题
import config from '@/defaultSettings'
import router from '@/router'
import store from '@/store'
import {
  default_animate,
  default_color,
  default_fixed_sidemenu,
  default_font_bold,
  default_layout_mode,
  default_multi_page,
  default_theme,
  loginType,
  sidebar_type
} from '@/store/mutation-types'
import vueBus from '@/utils/vueBus' // 中央事件总线
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less' // 蚂蚁金服antdUI组件样式
import 'babel-polyfill'
import moment from 'moment'
import 'normalize.css' // 浏览器默认样式重置
// 各类框架、插件
import Vue from 'vue'
import VueLazyload from 'vue-lazyload' // 懒加载插件
import storage from 'vue-ls' // 本地存储插件

// import 'vue2-animate/dist/vue2-animate.min.css'

Vue.config.productionTip = false
Vue.use(storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueLazyload, {
  listenEvents: ['scroll', 'resize', 'loaded']
})
Vue.use(vueBus)
Vue.use(gzcss)
Vue.use(uev)
// Vue.mixin(mixin)
moment.locale('zh-cn')
/**
 * 给全局对象挂载必要的常用工具
 */
Vue.prototype.$moment = moment

const env = process.env.NODE_ENV

new Vue({
  router,
  store,
  created() {
    // 设置项目名称
    store.commit('SET_APP_TITLE', config.appTitle)
    // 设置主名称
    store.commit('SET_MAIN_TITLE', config.mainTitle)
  },
  mounted() {
    // 设置登录模式
    store.commit(
      'SET_LOGIN_TYPE',
      env === 'development'
        ? Vue.ls.get(loginType, config.sysLoginMode)
        : config.sysLoginMode
    )
    // 设置是否拥有导航栏
    store.commit(
      'SET_SIDEBAR_TYPE',
      env === 'development' ? Vue.ls.get(sidebar_type, true) : true
    )
    // 设置亮暗色菜单
    store.commit(
      'TOGGLE_THEME',
      env === 'development'
        ? Vue.ls.get(default_theme, config.navTheme)
        : config.navTheme
    )
    // 设置导航位置（左侧，顶部）
    store.commit(
      'TOGGLE_LAYOUT_MODE',
      env === 'development'
        ? Vue.ls.get(default_layout_mode, config.navLayout)
        : config.navLayout
    )
    // 设置固定左侧菜单栏
    store.commit(
      'TOGGLE_FIXED_SIDERBAR',
      env === 'development'
        ? Vue.ls.get(default_fixed_sidemenu, config.fixSiderbar)
        : config.fixSiderbar
    )
    // 设置主题色
    store.commit(
      'TOGGLE_COLOR',
      env === 'development'
        ? Vue.ls.get(default_color, config.primaryColor)
        : config.primaryColor
    )
    // 设置是否多页签模式
    store.commit(
      'SET_MULTI_PAGE',
      env === 'development'
        ? Vue.ls.get(default_multi_page, config.multipage)
        : config.multipage
    )
    // 设置是否为大字号
    store.commit(
      'SET_FONT_TYPE',
      env === 'development'
        ? Vue.ls.get(default_font_bold, config.boldFont)
        : config.boldFont
    )
    // 设置是否开启转场动画
    store.commit(
      'SET_ANIMATE',
      env === 'development'
        ? Vue.ls.get(default_animate, config.animate)
        : config.animate
    )
  },
  render: h => h(App)
}).$mount('#app')
