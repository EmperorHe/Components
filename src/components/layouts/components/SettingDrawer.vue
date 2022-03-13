<template>
  <div class="setting-drawer">
    <!-- <a-button class="sys-setting-btn" type="primary" @click="showDrawer">
      <span class="font_family icon-shezhi"></span>
    </a-button> -->
    <a-drawer
      title="开发者个性主题设置"
      :width="400"
      :visible="visible"
      @close="onClose"
    >
      <a-button
        slot="handle"
        class="sys-setting-btn"
        type="primary"
        @click="showDrawer"
      >
        <span v-if="visible" class="font_family icon-shanchu1"></span>
        <span v-else class="font_family icon-shezhi"></span>
      </a-button>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">整体风格设置</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <div class="setting-drawer-index-blockChecbox">
              <a-tooltip>
                <template slot="title">
                  暗色菜单风格
                </template>
                <div
                  class="setting-drawer-index-item"
                  @click="handleMenuTheme('dark')"
                >
                  <img src="~@/assets/svg/dark-icon.svg" alt="dark" />
                  <div
                    v-if="navTheme === 'dark'"
                    class="setting-drawer-index-selectIcon"
                  >
                    <a-icon type="check" />
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip>
                <template slot="title">
                  亮色菜单风格
                </template>
                <div
                  class="setting-drawer-index-item"
                  @click="handleMenuTheme('light')"
                >
                  <img src="~@/assets/svg/light-icon.svg" alt="light" />
                  <div
                    v-if="navTheme !== 'dark'"
                    class="setting-drawer-index-selectIcon"
                  >
                    <a-icon type="check" />
                  </div>
                </div>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">主题色</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <a-tooltip
              v-for="(item, index) in colorList"
              :key="index"
              class="setting-drawer-theme-color-colorBlock"
            >
              <template slot="title">
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon
                  v-if="item.color === primaryColor"
                  type="check"
                />
              </a-tag>
            </a-tooltip>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">导航模式</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <div class="setting-drawer-index-blockChecbox">
              <a-tooltip>
                <template slot="title">
                  侧边栏导航
                </template>
                <div
                  class="setting-drawer-index-item"
                  @click="handleLayout('sidemenu')"
                >
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                    alt="sidemenu"
                  />
                  <div
                    v-if="layoutMode === 'sidemenu'"
                    class="setting-drawer-index-selectIcon"
                  >
                    <a-icon type="check" />
                  </div>
                </div>
              </a-tooltip>
              <a-tooltip>
                <template slot="title">
                  顶部栏导航
                </template>
                <div
                  class="setting-drawer-index-item"
                  @click="handleLayout('topmenu')"
                >
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                    alt="topmenu"
                  />
                  <div
                    v-if="layoutMode !== 'sidemenu'"
                    class="setting-drawer-index-selectIcon"
                  >
                    <a-icon type="check" />
                  </div>
                </div>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">开启页面切换转场动画</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <a-switch
              size="small"
              :defaultChecked="animate"
              @change="handleAnimate"
            />
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">大字号</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <a-switch
              size="small"
              :defaultChecked="boldFont"
              @change="handleFontBold"
            />
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="cell set-label">
          <span class="t">多页模式</span>
        </div>
        <div class="cell set-cont">
          <div class="set-wrap">
            <a-switch
              size="small"
              :defaultChecked="multipage"
              @change="handleMultipage"
            />
          </div>
        </div>
      </div>
      <div class="setting-info">
        <a-alert
          message="配置栏只在开发环境用于预览，生产环境不会展现，请手动修改src目录下的配置文件《defaultSettings.js》"
          type="warning"
        />
      </div>
      <textarea
        ref="setting-text"
        class="setting-text"
        v-html="configure"
      ></textarea>
      <a-button block @click="copyHandle">复制配置项</a-button>
    </a-drawer>
  </div>
</template>

<script>
import { mixin } from '@/utils/mixin.js'
import { updateTheme, colorList } from '@/utils/setting'
import { triggerWindowResizeEvent } from '@/utils/utils'
import config from '@/defaultSettings'

export default {
  mixins: [mixin],
  data() {
    return {
      colorList,
      configure: {},
      visible: false,
      dataFixSiderbar: false
    }
  },
  mounted() {
    this.configure = {
      primaryColor: this.primaryColor,
      navTheme: this.navTheme,
      navLayout: this.layoutMode,
      animate: this.animate,
      boldFont: this.boldFont,
      multipage: this.multipage
    }
    // 当主题色不是默认色或者字体大小不是默认大小时，才进行主题编译
    if (this.primaryColor !== config.primaryColor || this.boldFont) {
      updateTheme(this.primaryColor, this.boldFont ? '16px' : '14px')
    }
  },
  methods: {
    // 设置主题色
    changeColor(color) {
      if (this.primaryColor !== color) {
        this.configure.primaryColor = color
        this.$store.dispatch('ToggleColor', color)
        updateTheme(color, this.boldFont ? '16px' : '14px')
      }
    },
    // 修改整体风格
    handleMenuTheme(theme) {
      this.configure.navTheme = theme
      this.$store.dispatch('ToggleTheme', theme)
    },
    // 修改导航模式（侧边、头部）
    handleLayout(mode) {
      this.configure.layout = mode
      this.$store.dispatch('ToggleLayoutMode', mode)
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      this.handleFixSiderbar(false)
      // 触发窗口resize事件
      triggerWindowResizeEvent()
    },
    handleFixSiderbar(fixed) {
      if (this.layoutMode === 'topmenu') {
        fixed = false
      }
      this.dataFixSiderbar = fixed
      this.$store.dispatch('ToggleFixSiderbar', fixed)
    },
    // 是否开启转场动画
    handleAnimate(checked) {
      this.configure.animate = checked
      this.$store.dispatch('ToggleAnimate', checked)
    },
    // 修改是否为大字号
    handleFontBold(checked) {
      this.configure.boldFont = checked
      this.$store.dispatch('ToggleFontBold', checked)
      updateTheme(this.primaryColor, this.boldFont ? '16px' : '14px')
    },
    // 修改是否为多页模式
    handleMultipage(checked) {
      this.configure.multipage = checked
      this.$store.dispatch('ToggleMultipage', checked)
    },
    showDrawer() {
      if (this.visible) {
        this.visible = false
      } else {
        this.visible = true
      }
    },
    onClose() {
      this.visible = false
    },
    copyHandle() {
      const obj = this.$refs['setting-text']
      obj.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('成功复制！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-drawer {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 999;
	width: 0;
	height: 100%;
}
.setting-item {
	display: table;
	width: 100%;
	margin-bottom: 55px;
	table-layout: fixed;
	.cell {
		position: relative;
		display: table-cell;
		vertical-align: top;
	}
}
.set-label {
	width: 90px;
}
.set-cont {
	text-align: right;
}
.set-wrap {
	position: relative;
	display: inline-block;
	text-align: left;
}
.setting-drawer-index-blockChecbox {
	display: flex;
	.setting-drawer-index-item {
		position: relative;
		margin-right: 16px;
		cursor: pointer;
		border-radius: 4px;
		img {
			width: 48px;
		}
		.setting-drawer-index-selectIcon {
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
			padding-top: 15px;
			padding-left: 24px;
			font-size: 14px;
			font-weight: 700;
			color: #1890ff;
		}
	}
}
.setting-drawer-theme-color-colorBlock {
	float: left;
	width: 20px;
	height: 20px;
	padding-right: 0;
	padding-left: 0;
	margin-right: 8px;
	font-weight: 700;
	color: #fff;
	text-align: center;
	cursor: pointer;
	border-radius: 2px;
	i {
		font-size: 14px;
	}
}
.setting-drawer-index-handle {
	position: absolute;
	top: 240px;
	right: 300px;
	z-index: 1001;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	font-size: 16px;
	text-align: center;
	pointer-events: auto;
	cursor: pointer;
	background: #1890ff;
	border-radius: 4px 0 0 4px;
	i {
		font-size: 20px;
		color: rgb(255, 255, 255);
	}
}
.sys-setting-btn {
	position: absolute;
	top: 25px;
	bottom: 0;
	left: -48px;
	width: 48px;
	height: 48px;
	margin: auto 0;
	border-radius: 3px 0 0 3px;
}
.setting-info {
	position: relative;
	width: 100%;
	margin-bottom: 35px;
	::v-deep {
		.ant-alert,
		.ant-alert-message {
			text-align: justify;
		}
	}
}
.setting-message {
	text-align: justify;
}
.setting-text {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -111;
	width: 0;
	height: 0;
	padding: 0;
	margin: 0;
	overflow: hidden;
}
</style>
