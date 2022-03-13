## 组件说明

本组件为常用常见的白色容器，以外层容器的宽度、高度为容器的最小宽度和高度。提供四种模式配置，第一种只有一个标题，第二种为多个tab标题的模式。多个tab标题模式下，通过不同的组件插槽来实现tab间内容的显示隐藏。第三种可以通过设置`headTitle`具名插槽来自定义标题。第四种是只有一个标题，下面多个tab模块的模式。

## 属性API

| 参数          | 说明                     | 类型   | 可选值 | 默认值 |
| :------------ | :----------------------- | :-----: | :-----: | :----- |
| title | 仅一个标题模式下的标题文本设置。 | string | - | - |
| hasBackBtn | 是否显示返回按钮。 | boolean | - | false |
| titleTabs | 配置tab模式的标题tab配置项。具体配置可以参考下面`titleTabs[json]说明`。此项设置与下面`isContTab`配合，如果`isContTab`为`false`，则为多个tab标题，如果`isContTab`为`true`，则为一个标题下，多个tab模块。 | array[json] | - |
| isContTab | 是否为一个标题下多个tab页签形式。 | boolean | - | false |
| tabCurKey | 多tab标题下当前选中的tab的key。支持`.sync`数据双向绑定。 | string, number, null | - | - |

## titleTabs[json]说明

| 参数          | 说明                     | 类型   | 可选值 | 默认值 |
| :------------ | :----------------------- | :-----: | :-----: | :----- |
| key | 多tab标签下具体某个标签的唯一标识。 | string, number | - | - |
| tab | 多tab标签的标签名称。 | string | - | - |
| slot | 多tab标签对应某个标签的具名插槽名称。 | slot | - | - |

## 事件（@xxxx="function"）

| 事件名称 | 说明                       | 回调参数     |
| :------- | :------------------------- | :----------- |
| change  | 表单项内容变化时的回调。 | function(form, key) |
| preview  | 点击文件链接或预览图标时的回调。 | function(file) |

### Slot 组件插槽

| name       | 说明                                                                    |
| :--------- | :---------------------------------------------------------------------- |
| headTitle | 头部左侧的自定义具名插槽。不设置`title`或者`titleTabs`属性，可以自定义一个具名插槽来满足不同的标题设置。 |
| headHandle | 头部右侧的操作插槽内容，需要注意的是，必须组件拥有`title`或者`titleTabs`属性或者自定义插槽`headTitle`才会显示。 |
| tabHandle | 设置为一个标题，下面多个tab模块的模式，右侧的操作具名插槽。 |
| ——         | 自定义的内容默认插槽。仅当具有`title`（一个标题模式）或设置了`headTitle`具名插槽模式下，才有效。布局在头部以下的`div`模块。 |
| [titleTabs.json.slot] | 多个tab标签下，每个tab所定义的slot具名插槽名称的插槽。仅当设置了`titleTabs`属性才有效。 |

```javascript
<template>
  <uev-docs title="快速配置表单组件（ZvFormModel）" :markHtml="mark">
    <div class="docs-wrap">
      <!-- 示例代码开始 -->
      <div style="margin-bottom: 40px;">
        <h2>（一）仅有一个标题</h2>
        <zv-white-blog title="仅有一个标题的模式">
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <div class="demo">内容区域</div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（二）多个tab标题</h2>
        <zv-white-blog :titleTabs="titleTabs" :tabCurKey.sync="tabCurKey">
          <div slot="pane-1">这是第一个tab的内容</div>
          <div slot="pane-2">这是第二个tab的内容：这里具体测试一下</div>
          <div slot="headHandle">
            <zv-button :useAntBtn="true">操作按钮</zv-button>
          </div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（三）带返回按钮形式</h2>
        <zv-white-blog title="仅有一个标题的模式" :hasBackBtn="true">
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <div class="demo">内容区域</div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（四）一个标题多个tab形式</h2>
        <zv-white-blog
          title="某个事项标题"
          :isContTab="true"
          :titleTabs="contTabs"
          :tabCurKey.sync="contTabCurKey"
          :hasBackBtn="true"
        >
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <zv-button slot="tabHandle">操作&nbsp;&gt;&gt;</zv-button>
          <div slot="cont-pane-1">第一步：先填写基本信息。</div>
          <div slot="cont-pane-2">第二部：上传相应的附件。</div>
        </zv-white-blog>
      </div>
      <!-- 示例代码结束 -->
    </div>
  </uev-docs>
</template>

<script>
import mark from './README.md'

export default {
  name: 'DocsZvWhiteBlogIndex',
  data() {
    return {
      mark: mark,
      // tab标题
      titleTabs: [
        {
          key: '01', // tab的key
          tab: '第一个tab', // tab的标签名
          slot: 'pane-1' // tab对应组件插槽名称
        },
        {
          key: '02',
          tab: '第二个tab',
          slot: 'pane-2'
        }
      ],
      tabCurKey: '01',
      contTabs: [
        {
          key: 'cont-1', // tab的key
          tab: '第一步', // tab的标签名
          slot: 'cont-pane-1' // tab对应组件插槽名称
        },
        {
          key: 'cont-2',
          tab: '第二步',
          slot: 'cont-pane-2'
        }
      ],
      contTabCurKey: 'cont-1'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.demo {
  position: relative;
  width: 100%;
  height: 50px;
}
</style>
```