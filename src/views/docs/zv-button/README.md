## 组件说明

`zv-button`本组件是封装了普通文本样式和蚂蚁金服`a-button`和气泡确认框`a-popconfirm`组合而成的便捷按钮组件。

## 属性API

| 参数          | 说明                     | 类型   | 可选值 | 默认值 |
| :------------ | :----------------------- | :-----: | :-----: | :----- |
| type | 按钮的类型。 | string | 'default'（默认）\|\|'danger'（危险）\|\|'weak'（弱），如果是设置了`useAntBtn`为`true`，使用蚂蚁按钮来渲染，则可以继承使用`primary`、`dashed`、`danger`、`link`类型。 | default |
| iconName | icon的ClassName类名。 | string | - | - |
| secondConfirmText | 二次确认的文本。 | string | - | - |
| btnStyle | 按钮的样式。 | object | - | {} |
| okText | 二次确认气泡框的确认按钮文本。| string | - | {} |
| cancelText | 二次确认气泡框取消按钮的文本。 | string | - | {} |
| disabled | 是否禁用。 | boolean | - | false |
| useAntBtn | 是否使用蚂蚁金服按钮。 | boolean | - | false |
| title | 按钮原生的`title`属性。 | boolean | - | false |
| ghost | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。使按钮背景透明。 | boolean | - | false |
| htmlType | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。设置`button`原生的`type`值。 | boolean | - | false |
| icon | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。设置`button`原生的`type`值。 | boolean | - | false |
| loading | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。设置按钮载入状态。 | boolean \|\| { delay: number } | - | false |
| shape | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。设置按钮形状，可选值为`circle`、`round` 或者不设。 | string | - | default |
| size | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。设置按钮大小，可选值为 small large 或者不设。 | string | - | default |
| block | 蚂蚁金服Button属性，仅在本组件`useAntBtn`为`true`下才有效。将按钮宽度调整为其父宽度的选项。 | string | - | default |


## 事件（@xxxx="function"）

| 事件名称 | 说明                       | 回调参数     |
| :------- | :------------------------- | :----------- |
| click  | 点击按钮时的回调。在具有二次确认气泡框的模式下，为点击确定按钮的回调。 | function() |
| cancel  | 仅在具有二次确认气泡框的模式下有效，为点击取消按钮的回调。 | function() |

## 组件使用代码示例

```javascript
<template>
  <uev-docs title="便捷按钮组件（ZvButton）" :markHtml="mark">
    <div class="docs-wrap">
      <!-- 示例代码开始 -->
      <div class="demo">
        <zv-button>最普通的快捷按钮</zv-button>
      </div>
      <div class="demo">
        <zv-button :useAntBtn="true">使用蚂蚁金服按钮</zv-button>
      </div>
      <div class="demo">
        <zv-button type="danger">危险样式</zv-button>
      </div>
      <div class="demo">
        <zv-button type="weak">弱样式</zv-button>
      </div>
      <div class="demo">
        <zv-button :useAntBtn="true" type="danger">危险蚂蚁按钮</zv-button>
      </div>
      <div class="demo">
        <zv-button
          :useAntBtn="true"
          type="danger"
          secondConfirmText="正在进行二次确认？"
          >二次确认蚂蚁按钮</zv-button
        >
      </div>
      <div class="demo">
        <zv-button :disabled="true">禁用</zv-button>
      </div>
      <!-- 示例代码结束 -->
    </div>
  </uev-docs>
</template>

<script>
import mark from './README.md'

export default {
  data() {
    return {
      mark: mark
    }
  }
}
</script>
```