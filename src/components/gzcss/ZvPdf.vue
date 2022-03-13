<template>
  <div :key="id" class="zv-pdf-wrap">
    <div ref="view" class="zv-pdf-view" @scroll="scrollHandle">
      <div
        ref="mode"
        class="zv-pdf-mode"
        :style="{ transform: `scale(${scale})`, height: modeHeight }"
      >
        <div
          v-for="(item, index) in finishPage"
          :id="`${uid}-list-${index}`"
          :key="`zv-pdf-${index}`"
          class="zv-pdf-list"
          :style="{
            height: `${pageHeight[index]}px` || 'auto',
            padding: `${padding}px 0`
          }"
        >
          <div class="zv-pdf-item" :style="{ width: width }">
            <canvas :id="`${uid}-${index}`" height="100%"></canvas>
            <div v-if="pageNum || $slots.pageNum" class="zv-pdf-page">
              <slot v-if="$slots.pageNum" name="pageNum"></slot>
              <div v-else class="zv-pdf-page-default">
                第 {{ index + 1 }} 页
              </div>
            </div>
            <button v-if="!item" class="zv-pdf-mark">
              <a-spin :spinning="!item" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <zv-load
      :is-show="loading"
      :type-num="1"
      :tips-text="loadText"
      color="#3385ff"
    />
  </div>
</template>

<script>
import * as PDFJS from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker

// 将流数据转换为URL
function getObjectURL(file) {
  let url = null
  if (window.createObjectURL !== undefined) {
    // basic
    url = window.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    try {
      url = window.webkitURL.createObjectURL(file)
    } catch (error) {
      console.log('您提供的文件流有错误！')
    }
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    try {
      url = window.URL.createObjectURL(file)
    } catch (error) {
      console.log('您提供的文件流有错误！')
    }
  }
  return url
}

export default {
  name: 'ZvPdf',
  model: {
    prop: 'nowPage',
    event: 'pageChange'
  },
  props: {
    // PDF文件地址
    url: {
      type: [String, Object, Blob, undefined],
      default() {
        return undefined
      }
    },
    // 当前页面
    nowPage: {
      type: [Number, String],
      default() {
        return 1
      }
    },
    // 页与页之间的空隙
    padding: {
      type: Number,
      default() {
        return 4
      }
    },
    // 是否进行懒加载渲染页面
    layz: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 懒加载模式下，每一次加载多少页
    rateNum: {
      type: Number,
      default() {
        return 5
      }
    },
    // loading的文本
    loadText: {
      type: String,
      default() {
        return ''
      }
    },
    // 页面放大倍数
    scale: {
      type: Number,
      default() {
        return 1
      }
    },
    // 页码
    pageNum: {
      type: [Boolean, String],
      default() {
        return true
      }
    },
    // 页面的宽度
    width: {
      type: String,
      default() {
        return '210mm'
      }
    }
  },
  data() {
    return {
      id: `${new Date().valueOf()}${Math.floor(Math.random() * 100)}`,
      // zv-pdf-view元素
      view: null,
      // zv-pdf-mode元素
      modeView: null,
      viewHeight: 0,
      // PDF文档本身
      pdf: null,
      // PDF的总页数
      total: 0,
      // 已经成功加载的页面
      finishPage: [],
      // 页面的高度
      pageHeight: [],
      // 第一页的高度
      initH: 0,
      // 滚动的防抖定时器对象
      timer: null,
      // 定位到某也的防抖定时器对象
      postTimer: null,
      // 是否为自动触发的滚动
      isAutoScroll: false,
      isUserScroll: false,
      allRender: false,
      // 整个文档的loading
      loading: false,
      scrollTop: 0
    }
  },
  computed: {
    // uid
    uid() {
      return `zv-pdf-${this.id}`
    },
    // 导入PDF.js文件的PDF（地址）
    pdfUrl() {
      return this._blobToURL(this.url)
    },
    current() {
      const n = this.nowPage - 0
      let num = 0
      if (typeof n === 'number' && window.isNaN(n)) {
        num = 1
      } else {
        num = n
      }
      return num
    },
    modeHeight() {
      let result = null
      if (this.scale >= 1) {
        result = 'auto'
      } else {
        let h = 0
        for (let i = 0; i < this.pageHeight.length; i++) {
          h += this.pageHeight[i] * this.scale
        }
        result = `${h}px`
      }
      return result
    }
  },
  watch: {
    current(n, o) {
      if (this.isUserScroll) {
        this.isUserScroll = false
        if (n !== o) {
          this.$emit('change', n)
          this.loadPage()
        }
      } else {
        this.isUserScroll = false
        if (n > this.finishPage.length) {
          this.$emit('pageChange', this.finishPage.length)
          this.$emit('update:nowPage', this.finishPage.length)
          this.$emit('change', this.finishPage.length)
          this.postScrollPage(this.finishPage.length).then(() => {
            this.loadPage()
          })
        } else if (n < 1) {
          this.$emit('pageChange', 1)
          this.$emit('update:nowPage', 1)
          this.$emit('change', 1)
          this.postScrollPage(1).then(() => {
            this.loadPage()
          })
        } else {
          this.postScrollPage().then(() => {
            this.$emit('change', n)
            this.loadPage()
          })
        }
      }
    },
    scale() {
      this._nowActivePage()
    },
    url() {
      this.finishPage = []
      this.pageHeight = []
      this.initH = 0
      this.loading = true
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.view) {
          this.view.scrollTop = this.scrollTop
          this._nowActivePage()
        }
      }, 50)
    })
  },
  methods: {
    _blobToURL(url) {
      const type = Object.prototype.toString.call(url)
      console.log(type)
      let file
      switch (type) {
        case '[object Blob]':
          file = getObjectURL(url)
          break
        default:
          file = url
      }
      return file
    },
    init() {
      if (!this.pdfUrl) return
      this.id = `${new Date().valueOf()}${Math.floor(Math.random() * 100)}`
      this.loading = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.view = this.$refs['view']
          this.modeView = this.$refs['mode']
          this.viewHeight = this.view.clientHeight
          this.loadPdf()
        }, 300)
      })
    },
    loadPdf() {
      this.getPdf()
    },
    // 获取pdf，进行初始化
    getPdf() {
      PDFJS.getDocument(this.pdfUrl).promise.then(pdf => {
        this.pdf = pdf
        this.total = this.pdf.numPages
        this.finishPage = new Array(this.total).fill(false)
        this.$emit('download', this.pdf, this.total, this.pdfUrl)
        // setTimeout(() => {
        this.$nextTick(() => {
        // 永远先加载第一页
          this._renderPage(0).then(num => {
            const list = document.getElementById(`${this.uid}-list-${num}`)
            this.initH = list.offsetHeight
            this.pageHeight = new Array(this.total).fill(this.initH)
            if (this.current > 1) {
              this._renderPage(this.current - 1).then(() => {
                this.postScrollPage().then(() => {
                  if (this.layz) this.loading = false
                  this.$emit('ready', this.total, this.pdf)
                  this.loadPage()
                })
              })
            } else {
              if (this.layz) this.loading = false
              this.$emit('ready', this.total, this.pdf)
              this.loadPage()
            }
          })
        })
        // }, 100)
      })
    },
    // 加载某一页
    _renderPage(num) {
      return new Promise((resolve, reject) => {
        if (!this.finishPage[num]) {
          this.$set(this.finishPage, num, true)
          this.pdf.getPage(num + 1).then(page => {
            const viewport = page.getViewport({ scale: 2.0 })
            const w = viewport.width
            const h = viewport.height
            const canvas = document.getElementById(`${this.uid}-${num}`)
            if (canvas) {
              const context = canvas.getContext('2d')
              canvas.height = h
              canvas.width = w
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              }
              const renderTask = page.render(renderContext)
              renderTask.promise.then(() => {
                // console.log(`渲染了第 ${num + 1} 页`)
                this.$emit('render', this.num)
                if (num > 0) {
                  const list = document.getElementById(
                    `${this.uid}-list-${num}`
                  )
                  if (!list) return
                  const height = list.offsetHeight
                  this.$set(this.pageHeight, num, height)
                  resolve(num)
                } else {
                  resolve(num)
                }
              })
            } else {
              this.$set(this.finishPage, num, false)
            }
          })
        } else {
          resolve(num)
        }
      })
    },
    // 定位到目标页
    postScrollPage(num) {
      return new Promise(resolve => {
        clearTimeout(this.postTimer)
        this.postTimer = setTimeout(() => {
          this.isAutoScroll = true
          const n = num || this.current - 1
          let scrollH = 0
          for (let i = 0; i < n; i++) {
            scrollH += this.pageHeight[i] * this.scale
          }
          this.scrollTop = scrollH
          this.view.scrollTop = this.scrollTop
          this.$emit('pageChange', n + 1)
          this.$emit('update:nowPage', n + 1)
          resolve()
        }, 500)
      })
    },
    // 用户滚动操作页面
    scrollHandle() {
      if (this.isAutoScroll) {
        this.isAutoScroll = false
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this._nowActivePage()
      }, 300)
    },
    // 计算所有的页面的高度
    resetHeight() {
      setTimeout(() => {
        for (let i = 0; i < this.finishPage.length; i++) {
          const canvas = document.getElementById(`${this.uid}-${i}`)
          const h = canvas.offsetHeight + this.padding * 2
          i === 0 && (this.initH = h)
          if (this.finishPage[i]) {
            this.$set(this.pageHeight, i, h)
          } else {
            this.$set(this.pageHeight, i, this.initH)
          }
        }
        this.viewHeight = this.view.clientHeight
        this.postScrollPage(this.current - 1).then(() => {
          this.$emit('repaint', this.current, this.scale)
        })
      }, 100)
    },
    // 步入正轨
    loadPage() {
      const n = this.current - 1
      const result = []
      const frequency = Math.ceil(this.total / this.rateNum) + 1
      if (this.layz) {
        this._renderPage(n).then(() => {
          for (let i = 0; i < this.rateNum; i++) {
            const num = i - Math.floor(this.rateNum / 2)
            const page = num + n
            if (
              page < this.finishPage.length &&
              page > 0 &&
              !this.finishPage[page]
            ) {
              result.push(this._renderPage(page))
            }
          }
          Promise.all(result).then(() => {
            this._isFinishPage()
          })
        })
      } else {
        for (let i = 0; i < frequency; i++) {
          result.push(this.layzLoad(i))
        }
        Promise.all(result).then(() => {
          this._isFinishPage()
        })
      }
    },
    // 异步加载
    layzLoad(frequency) {
      return new Promise(resolve => {
        setTimeout(() => {
          const result = []
          for (let i = 0; i < this.rateNum; i++) {
            const num = i - Math.floor(this.rateNum / 2)
            const page = num + frequency * this.rateNum
            if (
              page < this.finishPage.length &&
              page > 0 &&
              !this.finishPage[page]
            ) {
              result.push(this._renderPage(page))
            }
          }
          Promise.all(result).then(() => {
            resolve()
          })
        }, 50)
      })
    },
    // 计算当前页在哪一页
    _nowActivePage() {
      const scrollH = this.view.scrollTop
      this.scrollTop = scrollH
      let prev = 0
      let next = 0
      for (let i = 0; i < this.pageHeight.length; i++) {
        i > 0 && (prev += this.pageHeight[i] * this.scale)
        next += this.pageHeight[i] * this.scale
        if (scrollH >= prev && scrollH < next) {
          const modeH = this.modeView.getBoundingClientRect().height
          const page =
            modeH === scrollH + this.viewHeight ? this.pageHeight.length : i + 1
          this.isUserScroll = true
          this.$emit('pageChange', page)
          this.$emit('update:nowPage', page)
          break
        }
      }
    },
    // 判断是否全部已经加载完毕
    _isFinishPage() {
      if (!this.allRender && this.finishPage.every(o => o === true)) {
        this.allRender = true
        if (!this.layz) this.loading = false
        this.$emit('load', this.total, this.pdf)
      }
    },
    // PDF容器改变后调用的方法
    resize() {
      this.resetHeight()
    }
  }
}
</script>

<style lang="scss" scoped>
.zv-pdf-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}
.zv-pdf-view {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	font-size: 0;
	line-height: 1;
	text-align: center;
	background-color: #eee;
}
.zv-pdf-mode {
	position: relative;
	display: inline-block;
	height: auto;
	vertical-align: top;
	transform-origin: center top;
}
.zv-pdf-list {
	position: relative;
	max-width: 97%;
	margin: 0 auto;
	.zv-pdf-item {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		background-color: #fff;
		box-shadow: 0 0 5px #ccc;
	}
	canvas {
		width: 100%;
	}
	.zv-pdf-page {
		position: absolute;
		right: 15px;
		bottom: 15px;
	}
	.zv-pdf-page-default {
		position: relative;
		font-size: 12px;
		line-height: 1;
		color: #aaa;
		text-align: right;
		white-space: nowrap;
		transform: scale(0.9);
	}
}
.zv-pdf-mark {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	text-align: center;
	cursor: default;
	background: transparent;
	.ant-spin {
		line-height: 0;
	}
}
</style>
