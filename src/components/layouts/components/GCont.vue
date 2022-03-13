<template>
  <div
    class="system-layout-view"
    :class="{ 'system-layout-view-odd': !multipage || onlyMain }"
  >
    <contextmenu
      :itemList="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <a-tabs
      v-if="multipage && !onlyMain"
      :active-key="activePage"
      class="system-layout-tabs"
      style="height: 52px;"
      :hide-add="true"
      type="editable-card"
      @contextmenu.native="e => onContextmenu(e)"
      @change="changePage"
      @edit="editPage"
    >
      <a-tab-pane
        v-for="page in pageList"
        :id="page.fullPath"
        :key="page.fullPath"
        :forceRender="true"
      >
        <span slot="tab" :pagekey="page.fullPath">{{ page.meta.title }}</span>
      </a-tab-pane>
    </a-tabs>
    <route-view class="system-layout-cont" />
  </div>
</template>

<script>
import Contextmenu from './Contextmenu'
import RouteView from '../RouteView'
import { mapState } from 'vuex'

const indexKey = '/dashboard/analysis'

export default {
  name: 'GCont',
  components: {
    Contextmenu,
    RouteView
  },
  data() {
    return {
      pageList: [],
      linkList: [],
      activePage: '',
      menuVisible: false,
      menuItemList: [
        {
          key: '4',
          icon: 'reload',
          text: '刷 新'
        },
        {
          key: '1',
          icon: 'arrow-left',
          text: '关闭左侧'
        },
        {
          key: '2',
          icon: 'arrow-right',
          text: '关闭右侧'
        },
        {
          key: '3',
          icon: 'close',
          text: '关闭其它'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      animate: state => state.app.animate, // 转场动画
      multipage: state => state.app.multipage,
      browserName: state => state.app.browserName,
      onlyMain: state => state.app.onlyMain
    })
  },
  watch: {
    // 左侧菜单被点击触发
    $route(newRoute) {
      this.activePage = newRoute.fullPath
      if (!this.multipage) {
        this.linkList = [newRoute.fullPath]
        this.pageList = [Object.assign({}, newRoute)]
      } else if (this.linkList.indexOf(newRoute.fullPath) < 0) {
        this.linkList.push(newRoute.fullPath)
        this.pageList.push(Object.assign({}, newRoute))
      } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
        const oldIndex = this.linkList.indexOf(newRoute.fullPath)
        const oldPositionRoute = this.pageList[oldIndex]
        this.pageList.splice(
          oldIndex,
          1,
          Object.assign({}, newRoute, {
            meta: oldPositionRoute.meta
          })
        )
      }
    },
    activePage(key) {
      const index = this.linkList.lastIndexOf(key)
      const waitRouter = this.pageList[index]
      this.$router.push(Object.assign({}, waitRouter))
    },
    multipage(newVal) {
      if (!newVal) {
        this.linkList = [this.$route.fullPath]
        this.pageList = [this.$route]
      }
    }
  },
  created() {
    if (this.$route.path !== indexKey) {
      this.pageList.push({
        path: indexKey,
        fullPath: indexKey,
        keepAlive: true,
        meta: {
          title: '首页'
        }
      })
      this.linkList.push(indexKey)
    }
    this.pageList.push(this.$route)
    this.linkList.push(this.$route.fullPath)
    this.activePage = this.$route.fullPath
    // 监听全局指示关闭当前tab的操作
    this.$bus.on('closeActiveTab', () => {
      setTimeout(() => {
        this.remove(this.activePage)
      }, 100)
    })
  },
  methods: {
    changePage(key) {
      this.activePage = key
    },
    editPage(key, action) {
      console.log(key, action)
      this[action](key)
    },
    remove(key) {
      this.$bus.emit('closeWinTab')
      if (key === indexKey) {
        this.$message.warning('首页不能关闭!')
        return
      }
      if (this.pageList.length === 1) {
        this.$message.warning('这是最后一页，不能再关闭了啦')
        return
      }
      this.$store.commit('SET_TAB_STATE', true)
      const removeRoute = this.pageList.filter(item => item.fullPath === key)
      this.pageList = this.pageList.filter(item => item.fullPath !== key)
      let index = this.linkList.indexOf(key)
      this.linkList = this.linkList.filter(item => item !== key)
      index = index >= this.linkList.length ? this.linkList.length - 1 : index
      this.activePage = this.linkList[index]

      // update-begin--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
      if (removeRoute && removeRoute[0]) {
        const componentName = removeRoute[0].meta.componentName
        // console.log('key: ', key, this.activePage)
        // console.log('componentName: ', componentName)
        this.$store.commit('DEL_ROUTE_CACHE', componentName)
      }
      // update-end--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
    },
    onContextmenu(e) {
      const pagekey = this.getPageKey(e.target)
      if (pagekey !== null) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    getPageKey(target, depth) {
      depth = depth || 0
      if (depth > 2) {
        return null
      }
      let pageKey = target.getAttribute('pagekey')
      pageKey =
        pageKey ||
        (target.previousElementSibling
          ? target.previousElementSibling.getAttribute('pagekey')
          : null)
      return (
        pageKey ||
        (target.firstElementChild
          ? this.getPageKey(target.firstElementChild, ++depth)
          : null)
      )
    },
    onMenuSelect(key, target) {
      const pageKey = this.getPageKey(target)
      switch (key) {
        case '1':
          this.closeLeft(pageKey)
          break
        case '2':
          this.closeRight(pageKey)
          break
        case '3':
          this.closeOthers(pageKey)
          break
        case '4':
          this.routeReload(pageKey)
          break
        default:
          break
      }
    },
    closeOthers(pageKey) {
      const index = this.linkList.indexOf(pageKey)
      if (pageKey === indexKey) {
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.activePage = this.linkList[0]
      } else {
        const indexContent = this.pageList.slice(0, 1)[0]
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.linkList.unshift(indexKey)
        this.pageList.unshift(indexContent)
        this.activePage = this.linkList[1]
      }
    },
    closeLeft(pageKey) {
      if (pageKey === indexKey) {
        return
      }
      const tempList = [...this.pageList]
      const indexContent = tempList.slice(0, 1)[0]
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(index)
      this.pageList = this.pageList.slice(index)
      this.linkList.unshift(indexKey)
      this.pageList.unshift(indexContent)
      if (this.linkList.indexOf(this.activePage) < 0) {
        this.activePage = this.linkList[0]
      }
    },
    closeRight(pageKey) {
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(0, index + 1)
      this.pageList = this.pageList.slice(0, index + 1)
      if (this.linkList.indexOf(this.activePage < 0)) {
        this.activePage = this.linkList[this.linkList.length - 1]
      }
    },
    routeReload() {
      const linkList = this.linkList
      const pageList = this.pageList
      const activePage = this.activePage
      this.reloadFlag = false
      const ToggleMultipage = 'ToggleMultipage'
      this.$store.dispatch(ToggleMultipage, false)
      this.$nextTick(() => {
        this.$store.dispatch(ToggleMultipage, true)
        this.reloadFlag = true
        this.linkList = linkList
        this.pageList = pageList
        this.activePage = activePage
      })
    },
    // update-begin-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
    dynamicRouterShow(key, title) {
      const keyIndex = this.linkList.indexOf(key)
      if (keyIndex >= 0) {
        const currRouter = this.pageList[keyIndex]
        const meta = Object.assign({}, currRouter.meta, {
          title: title
        })
        this.pageList.splice(
          keyIndex,
          1,
          Object.assign({}, currRouter, {
            meta: meta
          })
        )
      }
    }
    // update-end-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
  }
}
</script>

<style lang="scss" scoped>
.system-layout-cont {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}
.system-layout-view {
	position: relative;
	width: 100%;
	height: 100%;
	padding-top: 44px;
	&.system-layout-view-odd {
		padding-top: 0;
	}
}
.system-layout-tabs {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 44px !important;
	background-color: #fff;
	border-left: 1px solid #e6e9ea;
	::v-deep {
		.ant-tabs-bar {
			margin: 0;
		}
	}
}
.extra-img {
	width: 195px;
	margin-top: -60px;
	text-align: center;
	img {
		width: 100%;
	}
}
.mobile {
	.extra-img {
		width: 96px;
		margin-top: 0;
		text-align: center;
		img {
			width: 100%;
		}
	}
}
</style>
