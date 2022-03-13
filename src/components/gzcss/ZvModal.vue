<template>
  <a-modal
    :visible="visible"
    :wrapClassName="className"
    v-bind="mProps"
    :width="size === 'big' && !isFull ? '80%' : modalWidth"
    :bodyStyle="
      footerBtnOptions && isFull
        ? {
          'padding-bottom': `${footerBtnOptions.height || 68}px`
        }
        : {}
    "
    @cancel="onClose"
  >
    <div slot="title" class="zv-modal-title-wrap">
      <div class="zv-modal-title">
        <span
          v-if="this.title && this.title.length > 0"
          class="zv-modal-title-t"
        >{{ this.title }}</span>
        <div v-if="fullBtn" class="zv-modal-title-handle">
          <button class="zv-modal-change-win" type="button" @click="changeSize">
            <span
              :class="
                `font_family ${
                  isFull ? 'icon-shouqiquanping' : 'icon-quanping1'
                }`
              "
            ></span>
          </button>
        </div>
      </div>
    </div>
    <a-spin :spinning="spinning">
      <div
        class="zv-modal-body"
        :style="{
          padding: padding,
          height: size === 'big' && !isFull ? 'auto' : bodyH,
          'min-height': size === 'big' && !isFull ? '300px' : 'none',
          'max-height': maxHeight
        }"
      >
        <slot></slot>
      </div>
    </a-spin>
    <div slot="footer">
      <template v-if="footerBtnOptions">
        <div
          class="zv-modal-footer-wrap"
          :style="{
            'text-align': btnPlace,
            height:`${footerBtnOptions.height || 68}px`
          }"
        >
          <div class="zv-modal-footer-cell">
            <a-button
              v-for="(item, index) in footerBtnOptions.btnItems"
              v-show="!item.hidden"
              :key="index"
              class="zv-drawer-footer-btn"
              :class="item.className ? item.className : null"
              :type="item.type ? item.type : 'default'"
              :size="item.size ? item.size : 'default'"
              :loading="item.loading ? item.loading : false"
              :icon="item.icon ? item.icon : ''"
              :disabled="item.disabled ? item.disabled : false"
              @click="clickFn($event, item, item.clickFn)"
            >{{ item.title }}</a-button>
          </div>
        </div>
      </template>
    </div>
  </a-modal>
</template>
<script>
import { Modal } from 'ant-design-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ZvModal',
  model: {
    prop: 'visible',
    event: 'closeModal'
  },
  props: {
    ...Modal.props,
    // 底部按钮设置
    footerBtnOptions: {
      type: [Object, null],
      default() {
        return null
      }
    },
    // 弹出层的loading
    spinning: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 关闭弹窗是否销毁弹窗内容
    destroyOnClose: {
      type: Boolean,
      default() {
        return true
      }
    },
    wrapClassName: {
      type: String,
      default() {
        return ''
      }
    },
    // 设置容器的内边距
    padding: {
      type: String,
      default() {
        return '24px'
      }
    },
    // 点击蒙层是否允许关闭
    maskClosable: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否垂直显示弹窗
    centered: {
      type: Boolean,
      default() {
        return true
      }
    },
    title: {
      type: [String, Boolean],
      default() {
        return false
      }
    },
    // 是否显示全屏按钮
    fullBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 底部按钮位置
    btnPlace: {
      type: String,
      default() {
        return 'center'
      }
    },
    // 弹窗内容高度设置，超出部分以滚动条形式展示
    bodyHeight: {
      type: [Number, String],
      default() {
        return 'auto'
      }
    },
    // 预设的弹出大小宽度（三种类型）small default large
    size: {
      type: [String, null],
      default() {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      isFull: false
    }
  },
  computed: {
    ...mapGetters(['clientHeight']),
    mProps() {
      const result = {}
      for (const k in this.$props) {
        if (k !== 'title' && k !== 'visible') {
          result[k] = this.$props[k]
        }
      }
      return result
    },
    // 弹窗的外层class
    className() {
      const arr = ['zv-modal-handle']
      if (!this.title || this.title.length <= 0) arr.push('zv-modal-untitle')
      if (!this.footerBtnOptions) arr.push('zv-modal-handle-f')
      if (this.isFull) arr.push('zv-modal-handle-full')
      if (this.wrapClassName && this.wrapClassName.length > 0) {
        arr.push(this.wrapClassName)
      }
      const name = arr.join(' ')
      return name
    },
    bodyH() {
      let result = null
      if (this.isFull) {
        result = '100%'
      } else {
        if (this.size) {
          let h = 0
          switch (this.size) {
            case 'small':
              h = 440
              break
            case 'default':
              h = 540
              break
            case 'large':
              h = 700
              break
          }
          result = `${h -
            (this.title ? 55 : 32) -
            (this.footerBtnOptions && this.footerBtnOptions.height > 0
              ? this.footerBtnOptions.height
              : 0)}px`
        } else if (
          Object.prototype.toString.call(this.bodyHeight) === '[object Number]'
        ) {
          result = `${this.bodyHeight}px`
        } else {
          result = this.bodyHeight
        }
      }
      return result
    },
    // 弹窗的宽度
    modalWidth() {
      let w = 0
      if (!this.size && this.width) {
        w = this.width
      } else {
        switch (this.size) {
          case 'small':
            w = 640
            break
          case 'default':
            w = 720
            break
          case 'large':
            w = 880
            break
          default:
            w = 500
        }
      }
      return w
    },
    // 最大高度
    maxHeight() {
      let result = null
      if (this.isFull) {
        result = '100%'
      } else if (this.size === 'big') {
        result = `${this.clientHeight * 0.8 -
            (this.title ? 55 : 32) -
            (this.footerBtnOptions && this.footerBtnOptions.height > 0
              ? this.footerBtnOptions.height
              : 0)}px`
      } else {
        result = 'none'
      }
      return result
    }
  },
  methods: {
    // 点击关闭抽屉层
    onClose() {
      setTimeout(() => {
        this.isFull = false
      }, 300)
      this.$emit('close')
      this.$emit('closeModal', false)
    },
    handleOk() {
      this.$emit('comfirm')
    },
    changeSize() {
      this.isFull = !this.isFull
      this.$emit('resize', this.isFull)
    },
    // 点击按钮回调
    clickFn($event, config, fn) {
      const c = {}
      for (const k in config) {
        if (k !== 'clickFn') {
          c[k] = config[k]
        }
      }
      fn && fn($event, c)
    }
  }
}
</script>

<style lang="scss">
.zv-modal-handle {
	.ant-spin-nested-loading {
		width: 100%;
		height: 100%;
	}
	.ant-spin-container {
		width: 100%;
		height: 100%;
	}
	&.zv-modal-untitle {
		.ant-modal-header {
			border-bottom: 0;
		}
		.zv-modal-title-handle {
			top: 1px;
		}
		&.zv-modal-handle-full {
			.ant-modal-content {
				padding-top: 32px;
			}
		}
	}
	.ant-modal-footer {
		height: auto;
		padding: 0;
		text-align: center;
		.ant-btn {
			min-width: 70px;
			height: 36px;
			margin: 0 6px;
			:first-child {
				margin-left: 0;
			}
			:last-child {
				margin-right: 0;
			}
		}
	}
	.ant-modal-body {
		position: relative;
		width: 100%;
		padding: 0;
	}
	.zv-modal-body {
		position: relative;
		width: 100%;
		padding: 24px;
		overflow: auto;
	}
	.zv-modal-change-win {
		position: relative;
		width: 30px;
		height: 30px;
		margin-top: -3px;
		line-height: 1;
		color: rgba(0, 0, 0, 0.45);
		text-align: center;
		cursor: pointer;
		background: transparent;
		transition: color 0.3s;
		span {
			font-size: 18px;
		}
		&:hover {
			color: rgba(0, 0, 0, 1);
		}
	}
	&.zv-modal-handle-f {
		.ant-modal-footer {
			display: none;
		}
		&.zv-modal-handle-full {
			.ant-modal-content {
				padding-bottom: 0;
			}
		}
	}
	&.zv-modal-handle-full {
		.ant-modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100% !important;
			height: 100% !important;
			padding-bottom: 0;
		}
		.ant-modal-content {
			width: 100%;
			height: 100%;
			padding: 55px 0 0;
			border-radius: 0;
		}
		.ant-modal-body {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
			overflow-y: auto;
		}
		.ant-modal-header {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			border-radius: 0;
		}
		.ant-modal-footer {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
	.zv-modal-title-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		padding-right: 24px;
	}
	.zv-modal-title {
		position: relative;
		z-index: 10;
		width: 100%;
		height: 100%;
	}
	.zv-modal-title-handle {
		position: absolute;
		top: 0;
		right: -2px;
		bottom: 0;
		height: 100%;
		margin: auto 0;
	}
	.zv-modal-footer-wrap {
		position: relative;
		display: table;
		width: 100%;
		height: 100%;
	}
	.zv-modal-footer-cell {
		position: relative;
		display: table-cell;
		width: 100%;
		height: 100%;
		padding: 0 16px;
		vertical-align: middle;
	}
}
</style>
