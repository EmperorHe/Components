<template>
  <uev-docs title="ZvPdf核心PDF查看组件" :markHtml="mark">
    <div class="docs-wrap">
      <!-- 示例代码开始 -->
      <div style="margin-bottom: 40px;">
        <h2>（一）直接通过URL地址渲染</h2>
        <div class="pdf-demo-1">
          <zv-pdf
            v-model="pdfCurrent1"
            :url="pdfUrl"
            :rateNum="7"
            width="210mm"
            :scale="scale"
            @ready="readyHandle"
            @load="loadhandle"
            @change="changeHandle"
          />
          <div class="pdf-demo-handle">
            <span
              style="margin-right: 20px;"
            >第
              <a-input-number v-model="pdfCurrent1" style="width: 62px;" />
              页</span>
            <a-button style="margin-right: 20px;" @click="add">放大</a-button>
            <a-button @click="reduce">缩小</a-button>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（二）通过获取pdf文件对象（blob）渲染</h2>
        <div style="height: 500px;">
          <zv-pdf v-model="pdfCurrent2" :url="pdfObj" />
        </div>
      </div>
      <!-- 示例代码结束 -->
    </div>
  </uev-docs>
</template>

<script>
import mark from './README.md'
import axios from 'axios'

export default {
  name: 'DocsZvPdfIndex',
  data() {
    return {
      mark,
      pdfUrl:
        'http://172.16.11.143/attachment/courseware_entity/fb0e15edb0224b8aa8281f5de44d6675.pdf',
      pdfCurrent1: 18,
      scale: 1,
      pdfObj: undefined,
      pdfCurrent2: 1
    }
  },
  created() {
    this.getPdfBlob()
  },
  methods: {
    // 文档初始化完成
    readyHandle(num, obj) {
      console.log(num, obj)
    },
    // 全部页面已经加载完成
    loadhandle(num, obj) {
      console.log(num, obj)
    },
    // 当前页面更改时触发
    changeHandle(num) {
      console.log(num)
    },
    add() {
      this.scale = (this.scale + 0.1).toFixed(2) - 0
    },
    reduce() {
      this.scale = (this.scale - 0.1).toFixed(2) - 0
    },
    getPdfBlob() {
      axios
        .get(
          'http://172.16.11.78:9000/gzcss-boot/image/y4cyw7uh%4020778119155214855469756561151935691.pdf',
          {
            withCredentials: false,
            responseType: 'blob'
          }
        )
        .then(res => {
          // 将获取的文件流转换为blob对象传入PDF查看插件中
          const file = new Blob([res.data], {
            type: 'application/pdf'
          })
          this.pdfObj = file
          console.log(this.pdfObj)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-demo-1 {
	position: relative;
	width: 100%;
	height: 600px;
	padding-bottom: 58px;
}
.pdf-demo-handle {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 58px;
	padding: 12px 20px;
}
</style>
