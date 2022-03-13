<template>
  <div>
    <zv-play-layout
      :titlep="titlep"
      :back-text="backText"
      :back-fn="backFn"
      :show-side="showSide"
      :is-static="true"
      :change-cont="true"
    >
      <template slot="title">
        <slot name="title"></slot>
      </template>
      <template slot="rightSide">
        <slot name="contRight"></slot>
      </template>
      <template slot="mainCont">
        <div
          id="pdf_out"
          ref="pdfOut"
          class="zv-pdf-cont-div"
          @scroll="handleContScroll"
        >
          <div
            id="pdf_content"
            ref="pdfCont"
            class="pdf-container zv-pdf-canvas-cover-div"
            :style="{ transform: `scale(${contScale})` }"
          >
            <canvas
              v-for="page in totalPage"
              :id="'canvas' + page"
              :key="page"
            ></canvas>
          </div>
        </div>
        <div v-if="showLoading" class="zv-pdf-loading-div">
          <div class="inner-cover-div">
            <a-spin>
              <a-icon
                slot="indicator"
                type="loading"
                style="font-size: 36px;"
                spin
              />
            </a-spin>
          </div>
        </div>
      </template>
      <template slot="controlCont">
        <slot name="bottom"></slot>
        <zv-static-control
          :show-input="true"
          :total-page="totalPage"
          :set-page="currPage > totalPage ? totalPage : currPage"
          @changeScale="handleScaleChange"
          @pageScroll="ScrollToDefine"
        />
      </template>
    </zv-play-layout>
  </div>
</template>
<script>
import ZvPlayLayout from './ZvPlayLayout.vue'
import ZvStaticControl from './ZvStaticControl.vue'
import PDFJS from 'pdfjs-dist'

const CHUNK_SIZE = 4

export default {
  name: 'ZvPdf',
  components: { ZvPlayLayout, ZvStaticControl },
  props: {
    titlep: {
      type: String,
      default() {
        return '标题'
      }
    },
    backText: {
      type: String,
      default() {
        return '返回'
      }
    },
    // 是否显示右侧插槽
    showSide: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 附件链接
    addiUrl: {
      type: String,
      default() {
        return ''
      }
    },
    // 返回按钮事件
    backFn: {
      type: Function,
      default() {
        const _this = this
        return (function defaultfn() {
          _this.$router.back()
        })()
      }
    },
    // 设置页码
    setPage: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      totalPage: 0, // 总页数
      pageHeight: 0, // 每一页高度
      contScale: 1, // 放大倍数
      currPage: 1, // 当前页面
      pdfLoadend: false, // 是否渲染完成
      showLoading: false,
      beforePage: 1,
      canvasHeight: 0,
      initPageHeight: 0 // 初始化每一页的固定高度
    }
  },
  watch: {
    addiUrl: {
      handler(newv) {
        newv &&
          this.$nextTick(() => {
            this.initPdf()
          })
      },
      immediate: true
    },
    setPage(newv1) {
      console.log(newv)
      const newv = newv1 === 0 ? 1 : newv1
      if (this.pdfLoadend) {
        this.$refs.pdfOut.scrollTop = this.pageHeight * (newv - 1) + 10
        this.currPage = newv
      } else {
        const _timer = setInterval(() => {
          if (this.pdfLoadend) {
            this.$refs.pdfOut.scrollTop = this.pageHeight * (newv - 1) + 10
            this.currPage = newv
            clearInterval(_timer)
          }
        }, 50)
      }
    }
  },
  mounted() {},
  methods: {
    // 放大缩小操作按钮
    handleScaleChange(val) {
      this.contScale = val
      if (val === 0.2) {
        this.pageHeight = this.initPageHeight * 0.2
      } else if (val === 3) {
        this.pageHeight = this.initPageHeight * 3
      } else {
        this.pageHeight = this.initPageHeight * val
      }
      if (val < 1) {
        this.$refs.pdfCont.style.height = `${this.canvasHeight * val}px`
      } else {
        this.$refs.pdfCont.style.height = `auto`
      }
    },
    /**
     *  懒加载渲染pdf函数
     *  @params (pdf, renderNum)
     *  @paf  pdf实例对象
     *  @renderNum  每次渲染的页数
     *  @winW  换算pdf页面因子
     *  */
    renderPDF(pdf, winW, renderArr) {
      const renderNum = renderArr || []
      for (let i = 0; i < renderNum.length; i++) {
        // console.log(renderNum[i])
        pdf.getPage(renderNum[i]).then(page => {
          const viewport = page.getViewport(1)
          const scale = Number((winW / viewport.width).toFixed(2))
          const scaledViewport = page.getViewport(scale)
          const canvas = document.getElementById('canvas' + renderNum[i])
          const context = canvas.getContext('2d')
          canvas.height = scaledViewport.height
          canvas.width = scaledViewport.width
          this.pageHeight = Math.floor(scaledViewport.height)
          this.initPageHeight = Math.floor(scaledViewport.height)
          this.canvasHeight = this.pageHeight * renderNum.length
          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
          }
          page.render(renderContext)
          // console.log(new Date())
          i === renderNum.length && (this.pdfLoadend = true)
        })
      }
    },
    // 传进数组和指定个数，进行拆分
    chunk(array, size = CHUNK_SIZE) {
      // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
      const length = array.length
      // 判断不是数组，或者size没有设置，size小于1，就返回空数组
      if (!length || !size || size < 1) {
        return []
      }
      // 核心部分
      let index = 0 // 用来表示切割元素的范围start
      let resIndex = 0 // 用来递增表示输出数组的下标

      // 根据length和size算出输出数组的长度，并且创建它。
      const result = new Array(Math.ceil(length / size))
      // 进行循环
      while (index < length) {
        // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
        result[resIndex++] = array.slice(index, (index += size))
      }
      // 输出新数组
      return result
    },
    // 初始化pdf
    initPdf() {
      let winW = document.getElementById('pdf_content').clientWidth
      const loadingTask = PDFJS.getDocument(this.addiUrl)
      this.showLoading = true
      loadingTask.promise
        .then(pdf => {
          this.showLoading = false
          this.totalPage = pdf.numPages
          const chunckPdf = []
          for (let i = 1; i <= this.totalPage; i++) {
            chunckPdf.push(i)
          }
          const calculateArr = this.chunk(chunckPdf)
          winW = this.totalPage > 1 ? winW - 3 : winW
          for (let j = 0, _len = calculateArr.length; j < _len; j++) {
            ;(j => {
              setTimeout(() => {
                this.renderPDF(pdf, winW, calculateArr[j])
                console.log(j)
              }, (j + 1) * 1000)
            })(j)
          }
        })
        .catch(err => {
          console.log(err)
          this.showLoading = false
        })
    },

    // 滚动事件
    handleContScroll() {
      let _st = this.$refs.pdfOut.scrollTop
      _st = _st === 0 ? 1 : _st
      this.currPage = Math.ceil(_st / this.pageHeight)
      if (this.beforePage !== this.currPage) {
        this.$emit('pageChange', this.currPage, this.beforePage)
        this.beforePage = this.currPage
      }
    },

    // 页面跳转
    ScrollToDefine(val) {
      this.$refs.pdfOut.scrollTop = this.pageHeight * (val - 1)
    },

    // 获取pdf数据
    getPdfInfor() {
      return this.totalPage
    }
  }
}
</script>
<style lang="scss" scoped>
.zv-pdf-cont-div {
	position: relative;
	height: 100%;
	overflow: auto;
	.zv-pdf-canvas-cover-div {
		text-align: center;
		transform-origin: center top;
	}
}
.zv-pdf-loading-div {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba($color: #000, $alpha: 0.3);
	.inner-cover-div {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50px;
		height: 50px;
		margin-top: -25px;
		margin-left: 25px;
		line-height: 50px;
		text-align: center;
	}
}
</style>
