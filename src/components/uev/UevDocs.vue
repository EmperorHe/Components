<template>
  <zv-white-blog :title="title" :isAlwaysFullScreen="isAlwaysFullScreen">
    <div slot="headHandle" class="uev-docs-handle">
      <a-button @click="visible = true">说明文档</a-button>
    </div>
    <div class="uev-docs-cont" :class="defineClass">
      <slot></slot>
    </div>
    <a-drawer
      :title="`${title}说明文档`"
      :visible="visible"
      width="1000px"
      @close="visible = false"
    >
      <uev-mark-html :html="markHtml" />
    </a-drawer>
  </zv-white-blog>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default() {
        return ''
      }
    },
    markHtml: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否始终铺满展示区域
    isAlwaysFullScreen: {
      type: Boolean,
      default() {
        return false
      }
    },
    defineClass: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style lang="scss" scoped>
.uev-docs-handle {
	position: relative;
	width: 100%;
	padding: 10px 0;
}
.uev-docs-cont {
	position: relative;
	width: 100%;
	height: auto;
	padding: 20px;
}
</style>
