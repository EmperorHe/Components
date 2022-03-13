## 组件说明

本组件是继承于蚂蚁弹窗组件`a-modal`的基础上，将常用的底部按钮组件控制、标题控制进行了整合，并且扩展了可用于全屏和恢复大小的弹窗功能。并根据UI规范，设置了小（small）、中（default）、大（large）三种默认大小弹窗。

## 属性API

| 参数          | 说明                     | 类型   | 可选值 | 默认值 |
| :------------ | :----------------------- | :-----: | :-----: | :----- |
| footerBtnOptions | 底部按钮配置。一个包含配置按钮栏高度和按钮项的`json`对象。具体可以参考下面《footerBtnOptions配置说明示例》 | object(json)、null | - | null |
| spinning | 弹出层的loading状态 | boolean | - | false |
| destroyOnClose | 是否关闭弹窗后销毁弹窗内组件。 | boolean | - | true |
| wrapClassName | 对话框外层容器的类名 | string | - | - |
| padding | 设置内容容器的内边距 | string | - | 24px |
| maskClosable | 	点击蒙层是否允许关闭 | boolean | - | false |
| centered | 垂直居中展示弹窗 | boolean | - | true |
| title | 弹窗的标题 | string、boolean | - | false |
| fullBtn | 是否显示全屏化按钮 | boolean | - | true |
| visible（v-model） | 对话框是否可见，需要进行双向数据绑定 | boolean | - | - |
| width | 设置弹窗的宽度，如果设置了`size`属性，则此处设置值无效。 | nunber | - | 520 |
| btnPlace | 底部按钮的对其位置 | string | left \|\| center \|\| right | center |
| bodyHeight | 设置内容body的高度，如果设置了`size`属性，则此处设置值无效。 | number, string | - | 'auto' |
| size | 本弹窗组件内置的三种UI规范大小。 | string, null | small \|\| default \|\| large | null |

## footerBtnOptions配置说明示例

```javascript
// footerBtnOptions底部按钮配置代码示例
{
  height: 68,
  btnItems: [
    {
      title: '确定',        // 按钮的中文文本
      type: 'primary',      // 按钮类型，参考a-button对按钮的常规设置
      loading: false,       // 是否显示loading状态
      hidden: false,        // 是否隐藏
      disabled: false,      // 是否禁用
      clickFn: this.confirm // 点击的回调方法
    },
    {
      title: '取消',
      clickFn: this.hide
    }
  ]
}
```

## 组件使用代码示例

```javascript
<template>
  <uev-docs title="弹窗组件（ZvModal）" :markHtml="mark">
    <div style="margin-bottom: 40px;">
      <h2>（一）弹窗类型</h2>
      <div class="modal-button">
        <zv-button :useAntBtn="true" @click="visible1 = true"
          >点击打开（普通）弹窗</zv-button
        >
        <zv-button :useAntBtn="true" @click="visible2 = true"
          >点击打开可全屏弹窗</zv-button
        >
        <zv-button :useAntBtn="true" @click="visible3 = true"
          >点击打开设置了底部按钮的弹窗</zv-button
        >
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
            <zv-button :useAntBtn="true" @click="setLoad"
              >点击{{
                option.btnItems[0].loading ? '取消' : '设置'
              }}按钮Loading状态</zv-button
            >
          </div>
        </zv-modal>
        <!-- 示例代码结束 -->
      </div>
    </div>
    <div style="margin-bottom: 40px;">
      <h2>（二）弹窗默认大小示例</h2>
      <div class="modal-button">
        <zv-button :useAntBtn="true" @click="visible4 = true"
          >点击打开（小）弹窗</zv-button
        >
        <zv-button :useAntBtn="true" @click="visible5 = true"
          >点击打开（中）弹窗</zv-button
        >
        <zv-button :useAntBtn="true" @click="visible6 = true"
          >点击打开（大）弹窗</zv-button
        >
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
```