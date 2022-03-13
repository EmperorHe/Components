import { mapState } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout, // 设置导航模式（左侧，顶部）
      navTheme: state => state.app.theme, // 黑亮模式切换
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      multipage: state => state.app.multipage, // 多页签设置
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar.opened,
      boldFont: state => state.app.boldFont, // 大字号字体
      animate: state => state.app.animate // 转场动画
    })
  }
}

export { mixin }
