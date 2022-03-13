<template>
  <a-drawer
    wrapClassName="zv-drawer-handle"
    :closable="closable"
    :destroyOnClose="destroyOnClose"
    :maskClosable="maskClosable"
    :mask="mask"
    :maskStyle="maskStyle"
    :title="title"
    :visible="visible"
    :wrapStyle="wrapStyle"
    :width="width"
    :height="height"
    :zIndex="zIndex"
    :placement="placement"
    @close="onClose"
  >
    <a-spin :spinning="spinning">
      <div
        v-if="footerBtnOptions"
        class="zv-drawer-wrap"
        :class="className"
        :style="{
          padding: padding,
          'padding-bottom': footerBtnOptions.height + 'px'
        }"
      >
        <div class="zv-drawer-cont">
          <slot></slot>
        </div>
        <div
          class="zv-drawer-footer"
          :style="{ height: footerBtnOptions.height + 'px' }"
        >
          <div class="zv-drawer-footer-cell">
            <a-button
              v-for="(item, index) in footerBtnOptions.btnItems"
              :key="index"
              class="zv-drawer-footer-btn"
              :class="item.className ? item.className : null"
              :type="item.type ? item.type : 'default'"
              :size="item.size ? item.size : 'default'"
              :loading="item.loading ? item.loading : false"
              :icon="item.icon ? item.icon : ''"
              :disabled="item.disabled ? item.disabled : false"
              @click="clickFn(item.clickFn)"
            >
              {{ item.title }}
            </a-button>
          </div>
        </div>
      </div>
      <template v-else>
        <slot></slot>
      </template>
    </a-spin>
  </a-drawer>
</template>

<script>
import { Drawer } from 'ant-design-vue'

export default {
  name: 'ZvDrawer',
  extends: Drawer,
  props: {
    // 底部按钮设置
    footerBtnOptions: {
      type: [Object, null],
      default() {
        return null
      }
    },
    // 抽屉层的loading
    spinning: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 设置容器的内边距
    padding: {
      type: String,
      default() {
        return '20px 0 0 0'
      }
    },
    // 弹窗内容的包容器的className
    className: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 点击关闭抽屉层
    onClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    // 点击按钮回调
    clickFn(fn) {
      fn && fn()
    }
  }
}
</script>

<style lang="scss">
/* 抽屉设置 */
.zv-drawer-handle {
	.ant-drawer-header {
		position: relative;
		z-index: 9;
	}
	.ant-drawer-body {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 55px 0 0;
		> .ant-spin-nested-loading {
			position: relative;
			width: 100%;
			height: 100%;
			> div > .ant-spin {
				max-height: 90%;
			}
		}
		.ant-spin-container {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
	.zv-drawer-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.zv-drawer-cont {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0 26px;
		overflow: hidden;
		overflow-y: auto;
	}
	.zv-drawer-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		display: table;
		width: 100%;
		border-top: 1px solid #e6e9ea;
	}
	.zv-drawer-footer-cell {
		display: table-cell;
		text-align: center;
		vertical-align: middle;
	}
	.zv-drawer-footer-btn {
		min-width: 80px;
		margin: auto 10px;
		vertical-align: middle;
	}
	.zv-drawer-spin {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
	}
}
</style>
