<template>
  <div
    class="layout-header"
    :class="{
      'layout-header-dark': navTheme === 'dark' && layoutMode === 'topmenu'
    }"
    :style="{ height: headerHeight }"
  >
    <div class="layout-table">
      <div class="layout-cell logo-wrap">
        <router-link to="/" tag="span" :title="splicTitle">
          <template v-if="customLogo">
            <slot name="logoWrap"></slot>
          </template>
          <template v-else>
            <div class="logo-img">
              <img :src="logoUrl" />
            </div>
            <p v-if="mainTitle.length > 0" class="main-title">
              {{ mainTitle }}
            </p>
            <p v-if="minorTitle.length > 0" class="minor-title">
              {{ minorTitle }}
            </p>
          </template>
        </router-link>
      </div>
      <div class="layout-cell header-menu-wrap">
        <div v-if="layoutMode === 'topmenu'" class="header-index-wide">
          <div
            style="width: 100%;
							height: 100%;"
          >
            <s-menu mode="horizontal" :menu="menus" :theme="theme" />
          </div>
        </div>
      </div>
      <div class="layout-cell header-user-wrap">
        <g-user />
      </div>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/utils/mixin.js'
import SMenu from './menu.js'
import GUser from './GUser'

export default {
  components: {
    SMenu,
    GUser
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      default: 'sidemenu'
    },
    // 设置header顶部位置的高度
    headerHeight: {
      type: String,
      default() {
        return '52px'
      }
    },
    // 菜单
    menus: {
      type: Array,
      required: true
    },
    // 菜单的模式
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    // 是否自定义logo
    customLogo: {
      type: Boolean,
      default() {
        return false
      }
    },
    logoUrl: {
      type: String,
      default() {
        return ''
      }
    },
    mainTitle: {
      type: String,
      default() {
        return ''
      }
    },
    minorTitle: {
      type: String,
      default() {
        return ''
      }
    }
  },
  computed: {
    splicTitle() {
      return `${this.mainTitle}-${this.minorTitle}`
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: $primary-color;
}
.layout-table {
	position: absolute;
	top: 0;
	left: 0;
	display: table;
	width: 100%;
	height: 100%;
}
.layout-cell {
	position: relative;
	display: table-cell;
	vertical-align: middle;
}
.logo-wrap {
	padding: 0 20px;
	color: #fff;
	white-space: nowrap;
	cursor: pointer;
}
.logo-img {
	position: relative;
	display: inline-block;
	max-height: 34px;
	margin-right: 12px;
	vertical-align: middle;
}
.main-title {
	position: relative;
	display: inline;
	margin-right: 10px;
	font-size: 22px;
	line-height: 34px;
	vertical-align: middle;
}
.minor-title {
	position: relative;
	display: inline-block;
	height: 16px;
	padding: 9px 2px 0 11px;
	font-size: 16px;
	line-height: 16px;
	vertical-align: middle;
	&::before {
		position: absolute;
		top: 7px;
		left: 0;
		display: block;
		width: 1px;
		height: 20px;
		content: '';
		background-color: #fff;
	}
}
.header-menu-wrap {
	width: 100%;
}
.header-index-wide {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
