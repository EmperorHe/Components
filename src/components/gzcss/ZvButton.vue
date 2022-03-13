<template>
  <span
    class="zv-special-button-span"
    :class="{ 'zv-special-button-use-ant': useAntBtn }"
    :style="btnStyle"
  >
    <template v-if="!useAntBtn">
      <button
        v-if="!secondConfirmText || secondConfirmText.length <= 0"
        type="button"
        class="zv-special-button"
        :class="[
          {
            'zv-font-color': btnType === 1
          },
          {
            'zv-special-button-danger': btnType === 2
          },
          {
            'zv-special-button-disabled': disabled
          }
        ]"
        :title="title"
        :disabled="disabled"
        @click="confirmHandle"
      >
        <template v-if="this.$slots.btnCont">
          <slot name="btnCont"></slot>
        </template>
        <template v-else>
          <span
            v-if="iconName.length > 0"
            class="zv-special-button-icon font_family"
            :class="iconName"
          ></span>
          <div class="zv-special-button-t">
            <slot></slot>
          </div>
        </template>
      </button>
      <a-popconfirm
        v-else
        :title="secondConfirmText"
        :placement="placement"
        :visible="vis"
        :okText="okText"
        :cancelText="cancelText"
        @confirm="confirmHandle"
        @cancel="cancel"
      >
        <button
          class="zv-special-button zv-font-color"
          :class="[
            {
              'zv-font-color': btnType === 1
            },
            {
              'zv-special-button-danger': btnType === 2
            },
            {
              'zv-special-button-weak': btnType === 3
            },
            {
              'zv-special-button-disabled': disabled
            }
          ]"
          type="button"
          @click.stop="confirm"
        >
          <template v-if="this.$slots.btnCont">
            <slot name="btnCont"></slot>
          </template>
          <template v-else>
            <span
              v-if="iconName.length > 0"
              class="zv-special-button-icon font_family"
              :class="iconName"
            ></span>
            <div class="zv-special-button-t">
              <slot></slot>
            </div>
          </template>
        </button>
      </a-popconfirm>
    </template>
    <template v-else>
      <a-button
        v-if="!secondConfirmText || secondConfirmText.length <= 0"
        :type="type"
        :title="title"
        :disabled="disabled"
        :ghost="ghost"
        :htmlType="htmlType"
        :icon="icon"
        :loading="loading"
        :shape="shape"
        :size="size"
        :block="block"
        @click="confirmHandle"
      >
        <template v-if="this.$slots.btnCont">
          <slot name="btnCont"></slot>
        </template>
        <template v-else>
          <span
            v-if="iconName.length > 0"
            class="zv-special-button-icon font_family"
            :class="iconName"
          ></span>
          <div class="zv-special-button-t">
            <slot></slot>
          </div>
        </template>
      </a-button>
      <a-popconfirm
        v-else
        :title="secondConfirmText"
        :placement="placement"
        :visible="vis"
        :okText="okText"
        :cancelText="cancelText"
        @confirm="confirmHandle"
        @cancel="cancel"
      >
        <a-button
          :type="type"
          :disabled="disabled"
          :title="title"
          :ghost="ghost"
          :htmlType="htmlType"
          :icon="icon"
          :loading="loading"
          :shape="shape"
          :size="size"
          :block="block"
          @click.stop="confirm"
        >
          <template v-if="this.$slots.btnCont">
            <slot name="btnCont"></slot>
          </template>
          <template v-else>
            <span
              v-if="iconName.length > 0"
              class="zv-special-button-icon font_family"
              :class="iconName"
            ></span>
            <div class="zv-special-button-t">
              <slot></slot>
            </div>
          </template>
        </a-button>
      </a-popconfirm>
    </template>
  </span>
</template>

<script>
import { Popconfirm } from 'ant-design-vue'

export default {
  name: 'ZvButton',
  extends: Popconfirm,
  props: {
    // 类型
    type: {
      type: String,
      default() {
        return 'default'
      }
    },
    // icon的ClassName
    iconName: {
      type: String,
      default() {
        return ''
      }
    },
    // 二次确认的文本
    secondConfirmText: {
      type: String,
      default() {
        return ''
      }
    },
    // 按钮的样式
    btnStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    // 确定文本
    okText: {
      type: String,
      default() {
        return '确定'
      }
    },
    // 取消文本
    cancelText: {
      type: String,
      default() {
        return '取消'
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否使用蚂蚁金服的按钮
    useAntBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: [String, Boolean],
      default() {
        return false
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    ghost: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    htmlType: {
      type: String,
      default() {
        return 'button'
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    icon: {
      type: String,
      default() {
        return ''
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    loading: {
      type: [Boolean, Object],
      default() {
        return false
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    shape: {
      type: String
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    size: {
      type: String,
      default() {
        return 'default'
      }
    },
    // 蚂蚁金服Button属性，仅在本组件useAntBtn为true下才有效
    block: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      vis: false
    }
  },
  computed: {
    btnType() {
      let res = 1
      switch (this.type) {
        case 'default':
          res = 1
          break
        case 'danger':
          res = 2
          break
        case 'weak':
          res = 3
          break
      }
      return res
    }
  },
  created() {
    document.addEventListener('click', this.docClickCn)
    // this.$bus.on('documentClickBack', () => {
    //   this.vis = false
    // })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.docClickCn, false)
  },
  methods: {
    docClickCn() {
      this.vis = false
    },
    confirm() {
      if (this.disabled) return
      this.vis = !this.vis
    },
    confirmHandle() {
      if (this.disabled) return
      this.$emit('click')
    },
    cancel() {
      if (this.disabled) return
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-btn {
	line-height: 1;
}
.zv-special-button-span {
	margin-left: 20px;
	&:first-child {
		margin-left: 0;
	}
}
.zv-special-button-use-ant {
	margin-left: 0;
}
.zv-special-button {
	position: relative;
	text-decoration: none;
	white-space: nowrap;
	pointer-events: auto !important;
	cursor: pointer !important;
	background: transparent;
	&:hover {
		text-decoration: underline !important;
	}
}
.zv-special-button-danger {
	color: #ff4d4f;
}
.zv-special-button-weak {
	color: #bbb;
}
.zv-special-button-disabled {
	color: #cfcfcf !important;
	cursor: not-allowed !important;
	&:hover {
		text-decoration: none !important;
	}
}
.zv-special-button-icon {
	display: inline-block;
	vertical-align: middle;
}
.zv-special-button-t {
	display: inline-block;
	margin-left: 3px;
	white-space: nowrap;
	vertical-align: middle;
	&:first-child {
		margin-left: 0;
	}
}
</style>
