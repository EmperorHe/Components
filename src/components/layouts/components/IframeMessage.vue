<template>
  <span>
    <iframe-modal ref="modal" @close="close" />
    <iframe-drawer ref="drawer" @close="close" />
  </span>
</template>

<script>
import IframeModal from './IframeModal.vue'
import IframeDrawer from './IframeDrawer.vue'

export default {
  name: 'IframeMessage',
  components: {
    IframeModal,
    IframeDrawer
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('message', e => {
        const msg = e.data
        switch (msg.type) {
          case 'modal':
            if (msg.open) {
              this.$refs['modal'].open(msg.src, msg.config || {})
            } else if (msg.close) {
              this.$refs['modal'].close()
            }
            break
          case 'draw':
            if (msg.open) {
              this.$refs['drawer'].open(msg.src, msg.config || {})
            } else if (msg.close) {
              this.$refs['drawer'].close()
            }
            break
          case 'message':
            this.$message[msg.msgType](msg.config)
            break
        }
      }, false)
    })
  },
  methods: {
    // 关闭弹窗、抽屉层
    close(url) {
      window.document.querySelector('.zv-iframe-page-view').contentWindow.postMessage({
        type: 'close',
        url
      }, '*')
    }
  }
}
</script>
