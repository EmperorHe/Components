<template>
  <uev-docs title="弹窗组件（ZvModal）" :markHtml="mark">
    <div style="margin-bottom: 40px;">
      <h2>（一）弹窗类型</h2>
      <div class="modal-button">
        <zv-button
          :useAntBtn="true"
          @click="visible1 = true"
        >点击打开（普通）弹窗</zv-button>
        <zv-button
          :useAntBtn="true"
          @click="visible2 = true"
        >点击打开可全屏弹窗</zv-button>
        <zv-button
          :useAntBtn="true"
          @click="visible3 = true"
        >点击打开设置了底部按钮的弹窗</zv-button>
        <!-- 示例代码开始 -->
        <zv-modal :visible="visible1" :fullBtn="true" @close="visible1 = false">
          这是一个什么都没有的弹窗测试
        </zv-modal>
        <zv-modal
          :visible="visible2"
          title="具有全屏化的弹窗"
          :fullBtn="true"
          @close="visible2 = false"
        >
          这是一个什么都没有的弹窗测试
        </zv-modal>
        <zv-modal
          :visible="visible3"
          title="设置底部按钮弹窗"
          :fullBtn="true"
          :footerBtnOptions="option"
          btnPlace="right"
          @close="visible3 = false"
        >
          <div style="padding: 30px 0;">
            这是一个设置了底部按钮的弹窗测试
            <zv-button
              :useAntBtn="true"
              @click="setLoad"
            >点击{{
              option.btnItems[0].loading ? '取消' : '设置'
            }}按钮Loading状态</zv-button>
          </div>
        </zv-modal>
        <!-- 示例代码结束 -->
      </div>
    </div>
    <div style="margin-bottom: 40px;">
      <h2>（二）弹窗默认大小示例</h2>
      <div class="modal-button">
        <zv-button
          :useAntBtn="true"
          @click="visible4 = true"
        >点击打开（小）弹窗</zv-button>
        <zv-button
          :useAntBtn="true"
          @click="visible5 = true"
        >点击打开（中）弹窗</zv-button>
        <zv-button
          :useAntBtn="true"
          @click="visible6 = true"
        >点击打开（大）弹窗</zv-button>
        <zv-button
          :useAntBtn="true"
          @click="visible7 = true"
        >点击打开（超大）弹窗</zv-button>
        <zv-modal
          :visible="visible4"
          title="小弹窗（640px 440px）"
          :fullBtn="true"
          size="small"
          @close="visible4 = false"
        >
          这是一个小弹窗尺寸示例
        </zv-modal>
        <zv-modal
          :visible="visible5"
          title="中弹窗（720px 540px）"
          :fullBtn="true"
          size="default"
          @close="visible5 = false"
        >
          这是一个中弹窗尺寸示例
        </zv-modal>
        <zv-modal
          :visible="visible6"
          title="大弹窗（880px 700px）"
          :fullBtn="true"
          :footerBtnOptions="option"
          size="large"
          @close="visible6 = false"
        >
          这是一个大弹窗尺寸示例
        </zv-modal>
        <zv-modal
          :visible="visible7"
          title="大弹窗（宽：80%，最大高度： 80%）"
          :fullBtn="true"
          :footerBtnOptions="option"
          size="big"
          @close="visible7 = false"
        >
          这是一个超大弹窗尺寸示例
          <div
            contenteditable="true"
            style=" min-height: 100px;
	border: 1px solid #eee;
	border-radius: 4px;"
          ></div>
        </zv-modal>
      </div>
    </div>
  </uev-docs>
</template>

<script>
import mark from './README.md'
export default {
  name: 'DocsZvModalIndex',
  data() {
    return {
      mark: mark,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false,
      visible7: false,
      option: {
        height: 68,
        btnItems: [
          {
            title: '确定',
            type: 'primary',
            loading: false,
            clickFn: this.confirm
          },
          {
            title: '取消',
            clickFn: this.hide
          }
        ]
      }
    }
  },
  methods: {
    confirm() {},
    hide() {},
    setLoad() {
      this.$set(
        this.option.btnItems[0],
        'loading',
        !this.option.btnItems[0].loading
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-button {
	::v-deep {
		.zv-special-button-span {
			margin-right: 20px;
		}
	}
}
</style>
