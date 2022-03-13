<template>
  <span>
    <zv-modal
      :title="title"
      :size="size"
      :visible="visible"
      padding="0"
      :footerBtnOptions="foot"
      @close="visible = false"
    >
      <iframe
        :key="key"
        ref="iframe"
        class="system-iframe-modal"
        :src="src"
        @load="load"
      ></iframe>
      <zv-load :is-show="loading" />
    </zv-modal>
  </span>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      title: '',
      size: 'large',
      foot: null,
      src: null,
      loading: false,
      key: null
    }
  },
  methods: {
    open(src, config = {}) {
      Object.assign(this, {
        visible: true,
        title: config.title || '新建窗口',
        size: config.size || 'large',
        src: src || null,
        loading: true,
        key: new Date().valueOf(),
        foot: config.btnItems ? {
          height: 75,
          btnItems: config.btnItems.map((o, index) => {
            return {
              ...o,
              key: o.key || index,
              title: o.title || '按钮',
              clickFn: this.btnClick
            }
          })
        } : null
      })
    },
    close() {
      this.visible = false
      this.$refs['iframe'].contentWindow.postMessage({
        type: 'close'
      }, this.src)
      this.$emit('close', this.src)
    },
    btnClick(v, btn) {
      console.log(v, btn)
      this.$refs['iframe'].contentWindow.postMessage({
        type: 'btnClick',
        btn
      }, this.src)
    },
    load() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.system-iframe-modal {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	overflow: hidden;
	overflow-y: auto;
	border: 0;
	border-radius: 0 0 4px 4px;
}
</style>
