<template>
  <div
    class="menu-tree-wrap"
    :class="{
      'menu-tree-wrap-dark': navTheme === 'dark' && layoutMode === 'sidemenu',
      'menu-fixe-wrap': !this.isLock && !miniMenu,
      'menu-tree-mask': mask
    }"
    @mouseenter="overMenu"
    @mouseleave="outMenu"
  >
    <div class="menu-header">
      <transition name="fade">
        <div v-if="isLock || (!isLock && !miniMenu)" class="search-wrap">
          <input
            v-model="search"
            type="text"
            class="search-text"
            placeholder="搜索"
            @keypress.enter="doSearchMenu"
          />
          <button class="search-btn" type="button" @click="doSearchMenu">
            <span class="font_family">&#xe650;</span>
          </button>
        </div>
      </transition>
      <button
        class="active-btn"
        :title="this.isLock ? '点击解锁菜单' : '点击锁定菜单'"
        :class="{ 'active-btn-posit': !this.isLock && miniMenu }"
        type="button"
        @click="handleLock"
      >
        <span v-if="isLock" class="font_family">&#xe6bd;</span>
        <span v-else class="font_family">&#xe6bc;</span>
      </button>
    </div>
    <div class="menu-cont">
      <s-menu
        :key="menuKey"
        :collapsed="miniMenu"
        :mode="mode"
        :menu="filterMenus"
        :theme="theme"
        :defaultOpenKeys="defaultOpenKeys"
        :miniMenu="miniMenu"
      />
    </div>
  </div>
</template>

<script>
import SMenu from './menu'
import { mixin } from '@/utils/mixin'

export default {
  components: {
    SMenu
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      default() {
        return 'inline'
      }
    },
    theme: {
      type: String,
      default: 'dark'
    },
    menus: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    isLock: {
      type: Boolean,
      required: true,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      search: '',
      menuKey: 0,
      filterMenus: [],
      defaultOpenKeys: [],
      thumbtack: false,
      miniMenu: false,
      mask: false,
      timer: null
    }
  },
  created() {
    this.filterMenus = this.menus.concat()
    // console.log('[主菜单]', this.filterMenus)
  },
  methods: {
    doSearchMenu() {
      let arr = []
      this.menuKey = new Date().getTime()
      if (this.search.trim().length > 0) {
        arr = this.doFilterMenus(this.menus.concat())
        this.filterMenus = arr
      } else {
        this.defaultOpenKeys = []
        this.filterMenus = this.menus.concat()
      }
    },
    doFilterMenus(arr) {
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        let res = []
        let json = {}
        if (
          arr[i].children &&
          Array.isArray(arr[i].children) &&
          arr[i].children.length > 0
        ) {
          // 进入重新遍历
          res = this.doFilterMenus(arr[i].children)
          if (res.length > 0) {
            json = JSON.parse(JSON.stringify(arr[i]))
            json.children = res
            newArr.push(json)
            this.defaultOpenKeys.push(json.path)
          }
        } else {
          // 最底层
          if (arr[i].meta.title.indexOf(this.search) >= 0) {
            newArr.push(arr[i])
          }
        }
      }
      return newArr
    },
    handleSize() {
      let size = ''
      this.miniMenu = !this.miniMenu
      size = this.miniMenu ? 'mini' : 'normal'
      this.$emit('changeSize', size)
    },
    handleLock() {
      if (this.isLock) {
        this.miniMenu = true
        this.mask = true
        this.$emit('update:isLock', false)
        this.$emit('activeLock')
      } else {
        this.miniMenu = false
        this.$emit('update:isLock', true)
      }
    },
    // 鼠标移入菜单
    overMenu() {
      if (!this.isLock && this.miniMenu) {
        this.miniMenu = false
        this.removeMask()
      }
    },
    // 鼠标溢出菜单
    outMenu() {
      if (!this.isLock) {
        this.miniMenu = true
        this.mask = true
        clearTimeout(this.timer)
      }
    },
    // 定时移除遮罩
    removeMask() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.mask = false
      }, 700)
    },
    enterHandle() {
      console.log('aaa')
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-tree-wrap {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	width: 100%;
	height: 100%;
	padding-top: 44px;
	&.menu-fixe-wrap {
		width: 201px;
	}
	&.menu-tree-mask {
		&::after {
			position: absolute;
			top: 44px;
			left: 0;
			z-index: 99999;
			display: block;
			width: 100%;
			height: 100%;
			cursor: default;
			content: '';
		}
	}
}
.menu-header {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 44px;
	padding: 8px 45px 8px 12px;
}
.search-wrap {
	position: relative;
	width: 100%;
	height: 28px;
	padding: 0 32px 0 12px;
	background-color: #f1f1f1;
	border-radius: 15px;
}
.search-text {
	position: relative;
	width: 100%;
	height: 100%;
	padding: 0 4px;
	background: transparent;
	border: 0;
}
.search-btn {
	position: absolute;
	top: 2px;
	right: 9px;
	width: 20px;
	height: 20px;
	color: #9f9f9f;
	background: transparent;
}
.active-btn {
	position: absolute;
	top: 0;
	right: 7px;
	bottom: 0;
	width: 30px;
	height: 30px;
	margin: auto 0;
	background: transparent;
	transition: right 0.2s;
	&.active-btn-posit {
		right: 17px;
	}
}
.menu-cont {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}
.menu-tree-wrap-dark {
	.search-text,
	.search-btn,
	.active-btn {
		color: #fff;
	}
}
</style>
