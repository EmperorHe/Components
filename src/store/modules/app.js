import {
  default_animate,
  default_color,
  default_fixed_sidemenu,
  default_font_bold,
  default_layout_mode,
  default_multi_page,
  default_theme, sidebar_type
} from '@/store/mutation-types'
import Vue from 'vue'

const app = {
  state: {
    // 项目名称
    appTitle: '',
    // 项目主名称
    mainTitle: '',
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    theme: '', // 设置亮暗色
    layout: '', // 导航左侧或者顶部布局
    fixSiderbar: false, // 固定左侧菜单
    color: null, // 主题色
    multipage: true, // 默认多页签模式
    boldFont: false, // 大字号
    animate: false, // 转场动画
    appMask: false, // #app的遮罩层，
    refresh: 0,
    browserName: '', // 浏览器名称
    browserVersion: '', // 浏览器版本
    // 系统登录模式
    loginType: '',
    // 是否需要出现全局错误提示
    isWholeTips: true,
    isCloseHandle: false,
    // 是否只显示中间主内容模块
    onlyMain: false,
    // 可视区宽
    clientWidth: 0,
    // 可视区高
    clientHeight: 0
  },
  mutations: {
    SET_APP_TITLE(state, data) {
      state.appTitle = data
    },
    SET_MAIN_TITLE(state, data) {
      state.mainTitle = data
    },
    SET_BROWSER(state, type) {
      state.browserName = type.client.name
      state.browserVersion = type.client.version
    },
    SET_SIDEBAR_TYPE(state, type) {
      state.sidebar.opened = type
      Vue.ls.set(sidebar_type, type)
    },
    SET_REFRESH(state, num) {
      state.refresh = num
    },
    CLOSE_SIDEBAR(state, withoutAnimation) {
      Vue.ls.set(sidebar_type, true)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_THEME(state, theme) {
      // setStore('_DEFAULT_THEME', theme)
      Vue.ls.set(default_theme, theme)
      state.theme = theme
    },
    TOGGLE_LAYOUT_MODE(state, layout) {
      Vue.ls.set(default_layout_mode, layout)
      state.layout = layout
    },
    TOGGLE_FIXED_SIDERBAR(state, fixed) {
      Vue.ls.set(default_fixed_sidemenu, fixed)
      state.fixSiderbar = fixed
    },
    TOGGLE_COLOR(state, color) {
      Vue.ls.set(default_color, color)
      state.color = color
    },
    SET_MULTI_PAGE(state, multipageFlag) {
      Vue.ls.set(default_multi_page, multipageFlag)
      state.multipage = multipageFlag
    },
    SET_FONT_TYPE(state, type) {
      Vue.ls.set(default_font_bold, type)
      state.boldFont = type
    },
    SET_ANIMATE(state, type) {
      Vue.ls.set(default_animate, type)
      state.animate = type
    },
    SET_APP_MASK(state, type) {
      state.appMask = type
    },
    SET_LOGIN_TYPE(state, type) {
      state.loginType = type
    },
    SET_WHOLE_TIPS(state, data) {
      state.isWholeTips = data
    },
    SET_CACHELIST(state, data) {
      state.cacheList = data
    },
    SET_KEYSLIST(state, data) {
      state.keysList = data
    },
    SET_NAMEKEYLIST(state, key, data) {
      state.nameKeyList[key] = data
    },
    SET_PAGELIST(state, data) {
      state.pageList = data
    },
    PUSH_PAGELIST(state, json) {
      state.pageList.push(json)
    },
    SPLICE_PAGELIST(state, index, num, item) {
      if (item) {
        state.pageList.splice(index, num, item)
      } else if (num) {
        state.pageList.splice(index, num)
      } else {
        state.pageList.splice(index)
      }
    },
    UNSHIFT_PAGELIST(state, item) {
      state.pageList.unshift(item)
    },
    // 设置是否关闭标签操作
    SET_TAB_STATE(state, data) {
      state.isCloseHandle = data
    },
    // 设置是否只显示主模块
    SET_ONLY_MAIN(state, data) {
      state.onlyMain = data
    },
    SET_WIN_WIDTH(state, data) {
      state.clientWidth = data
    },
    SET_WIN_HEIGHT(state, data) {
      state.clientHeight = data
    }
  },
  actions: {
    setSidebar({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    // 设置亮暗色菜单
    ToggleTheme({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    // 设置导航模式（左侧，顶部）
    ToggleLayoutMode({ commit }, mode) {
      commit('TOGGLE_LAYOUT_MODE', mode)
    },
    // 设置固定左侧菜单栏
    ToggleFixSiderbar({ commit }, fixSiderbar) {
      commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    // 配置主题色
    ToggleColor({ commit }, color) {
      commit('TOGGLE_COLOR', color)
    },
    // 设置是否多页签模式
    ToggleMultipage({ commit }, multipageFlag) {
      commit('SET_MULTI_PAGE', multipageFlag)
    },
    // 设置是否大字号
    ToggleFontBold({ commit }, type) {
      commit('SET_FONT_TYPE', type)
    },
    // 设置是否开启转场动画
    ToggleAnimate({ commit }, type) {
      commit('SET_ANIMATE', type)
    },
    // 设置app遮罩层
    ToggleAppMask({ commit }, type) {
      commit('SET_APP_MASK', type)
    }
  }
}

export default app
