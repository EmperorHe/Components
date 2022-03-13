<template>
  <div class="zv-workbench-wrap">
    <div
      class="layout-wrap"
      :style="{ 'padding-top': onlyMain ? 0 : headerHeight }"
    >
      <g-header
        :headerHeight="headerHeight"
        :mode="layoutMode"
        :menus="navMenus"
        :theme="navTheme"
        :logoUrl="logo"
        :mainTitle="appTitle"
        :minorTitle="mainTitle"
        :style="onlyMain ? { display: 'none' } : {}"
      />
      <div class="layout-main">
        <div
          v-if="layoutMode === 'sidemenu' && !onlyMain"
          class="layout-left-menu"
          :class="{
            'layout-left-menu-dark':
              navTheme === 'dark' && layoutMode === 'sidemenu'
          }"
          :style="{ width: menuWidth + 'px' }"
        >
          <!-- 左侧菜单 -->
          <side-menu
            :menus="navMenus"
            :theme="navTheme"
            :collapsed="false"
            :isLock.sync="isLock"
            @changeLock="handleLock"
          />
          <button
            v-if="isLock"
            class="move-btn"
            @mousedown="moveHandle($event)"
          ></button>
        </div>
        <div class="layout-main-wrap">
          <div class="layout-main-view">
            <!-- 页面内容 -->
            <g-cont />
          </div>
        </div>
      </div>
      <setting-drawer v-if="isDevEnv" />
    </div>
  </div>
</template>

<script>
import GHeader from './components/GHeader' // 头部组件
import GCont from './components/GCont' // 内容部分组件
import SideMenu from './components/SideMenu' // 菜单组件
import SettingDrawer from './components/SettingDrawer' // 开发者设置主题组件
import { mixin } from '@/utils/mixin' // 公共方法
import { mapState } from 'vuex'
import { addEvent, offEvent } from '@/utils/event'
import { triggerWindowResizeEvent } from '@/utils/utils'
import { baseRouterMap } from '@/router/routerConfig'

export default {
  components: {
    GHeader,
    GCont,
    SideMenu,
    SettingDrawer
  },
  mixins: [mixin],
  props: {
    // 设置header顶部位置的高度
    headerHeight: {
      type: String,
      default() {
        return '52px'
      }
    }
  },
  data() {
    return {
      logo: require('@/assets/images/logo/logo-mini-white.png'),
      collapsed: false,
      menuWidth: 201,
      defaultMenuWidth: 0,
      isLock: true,
      navMenus: []
    }
  },
  computed: {
    ...mapState({
      appTitle: state => state.app.appTitle,
      mainTitle: state => state.app.mainTitle,
      menusList: state => state.user.menus,
      onlyMain: state => state.app.onlyMain
    }),
    isDevEnv() {
      return process.env.VUE_APP_BRANCH_ENV !== 'production'
    }
  },
  watch: {
    sidebarOpened(val) {
      this.collapsed = !val
    },
    isLock(val) {
      if (val) {
        this.menuWidth = this.defaultMenuWidth
      } else {
        this.menuWidth = 65
      }
    }
  },
  created() {
    this.defaultMenuWidth = this.menuWidth - 0
    // 设置菜单项
    this.navMenus = baseRouterMap[0].children
  },
  methods: {
    moveHandle(event) {
      this.$store.dispatch('ToggleAppMask', true)
      const startX = event.screenX
      let moveX = 0
      const startW = this.menuWidth - 0
      let moveW = 0
      const docMoveEvent = addEvent(document, 'mousemove', event => {
        moveX = event.screenX - startX
        moveW = startW + moveX
        if (moveW < this.defaultMenuWidth) {
          moveW = this.defaultMenuWidth
        }
        this.menuWidth = moveW
      })
      const docUpEvent = addEvent(document, 'mouseup', () => {
        this.$store.dispatch('ToggleAppMask', false)
        triggerWindowResizeEvent()
        offEvent(document, 'mousemove', docMoveEvent)
        offEvent(document, 'mouseup', docUpEvent)
      })
    },
    // 切换左侧带单的最小化和正常化
    handleChangeSize() {},
    // 锁定与非锁定
    handleLock() {}
  }
}
</script>

<style lang="scss" scoped>
.zv-workbench-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}
.layout-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	padding-top: 50px;
}
.layout-main {
	position: relative;
	width: 100%;
	height: 100%;
}
.layout-left-menu {
	position: relative;
	float: left;
	width: 201px;
	height: 100%;
	vertical-align: top;
	background-color: #fff;
}
.layout-main-wrap {
	position: relative;
	width: auto;
	height: 100%;
	overflow: hidden;
	vertical-align: top;
}
.layout-main-view {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.move-btn {
	position: absolute;
	top: 0;
	right: -3px;
	z-index: 10;
	width: 6px;
	height: 100%;
	cursor: col-resize;
	opacity: 0;
}
</style>
