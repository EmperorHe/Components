## 组件说明

`zv-pdf`组件是根据PDF.js封装的PDF阅读器组件。提供了全部默认加载和懒加载两种前端渲染模式。本组件不提供默认的操作按钮，是PDF阅读器的核心，业务组件可根据实际业务再行封装。

## 属性API

| 参数          | 说明                     | 类型   | 可选值 | 默认值 |
| :------------ | :----------------------- | :-----: | :-----: | :----- |
| url | PDF文件的URL地址（可以是文件blob对象的形式）。 | string, object | - | undefined |
| nowPage（v-model） | 当前浏览的页面页码。支持通过`.sync`或`v-model`进行双向数据绑定。正整数。 | number | - | 1 |
| padding | 页面上下间的内边距。以像素为单位的整数。 | number | - | 4 |
| layz | 是否进行前端懒加载渲染页面。设置为`false`时，会将整个文档进行渲染。 | boolean | - | true |
| rateNum | `layz`为设置为懒加载模式时，一次性会加载多少页（当前页、前几页、后几页的总和）。 | number | 5 |
| loadText | 加载PDF文档时的文本文字。 | string | - | - |
| scale | 页面的放大倍数。1为正常倍数。 | number | - | 1 |
| pageNum | 是否设置组件每个页面的页码。| boolean, slot | - | true |
| width | 页面的宽度。默认为A4纸大小的宽度——210mm。 | string | - | 210mm |

## 方法（使用方法：this.$refs[xxx].xxxx()）

| 方法名          | 说明      | 参数 |
| :------| :-------------| :----- |
| resize | PDF查看组件容器大小改变时，调用此方法触发组件内部重新计算。 | - |

## 事件（@xxxx="function"）

| 事件名称 | 说明                       | 回调参数     |
| :------- | :------------------------- | :----------- |
| download | PDF文档下载解析结束触发的方法。返回三个参数，第一个是这个PDF文件对象，第二个为文档的总页数，第三个为文档的url地址（可用于文档下载打印等）。 | function(pdfObj, total) |
| ready  | PDF文档准备完毕，渲染出了第一个页面和一个目标页面后触发。返回两个参数，第一个为文档的总页数，第二个是这个PDF文件对象。 | function(total, pdfObj) |
| load  | PDF文档所有文件渲染完成触发，如果是懒加载的形式，需要用户手动查看完全部的文档页面才能触发。返回两个参数，第一个为文档的总页数，第二个是这个PDF文件对象。 | function(total, pdfObj) |
| change | PDF查看组件内当前页面发生改变时触发的方法。返回一个参数，当前查看的页面页码。 | function(nowPage) |
| render | 每一页成功渲染后触发的方法，返回一个参数，当前渲染成功的页面页码。 | function(pagenum) |
| repaint | PDF缩放或触发重绘计算各页面大小时触发的方法。返回两个参数，第一个参数，当前查看的页面页码；第二个参数是当前页面的放大倍数。 | function(nowPage, scale) |

## 组件使用代码示例

```javascript
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
            <span style="margin-right: 20px"
              >第
              <a-input-number v-model="pdfCurrent1" style="width: 62px" />
              页</span
            >
            <a-button style="margin-right: 20px" @click="add">放大</a-button>
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
```