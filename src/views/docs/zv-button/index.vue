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
        >二次确认蚂蚁按钮</zv-button>
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
  name: 'DocsZvButtonIndex',
  data() {
    return {
      mark: mark
    }
  }
}
</script>

<style scoped>
.demo {
	display: inline-block;
	margin-right: 25px;
}
</style>
