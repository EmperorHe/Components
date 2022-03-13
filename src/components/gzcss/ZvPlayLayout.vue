<template>
  <div
    class="zv-play-layout-div"
    :class="{ 'zv-play-hide-side': !showSide || hideSide }"
  >
    <!-- 展开收起按钮 -->
    <span
      v-if="showSide"
      class="zv-side-control-span"
      @click="handleSideControl"
    >
      <i
        class="font_family"
        :class="hideSide ? 'icon-zuoce' : 'icon-youce1'"
      ></i>
    </span>
    <!-- 右侧插槽 -->
    <div class="zv-play-right-cont">
      <slot name="rightSide"></slot>
    </div>
    <!-- 内容区 -->
    <div
      ref="mediumViews"
      class="zv-play-cont-div"
      @mouseover="contHandleMouseover"
      @mouseout="contHandleMouseOut"
      @mousemove="contHandleMouseMove"
    >
      <!-- 标题部分 -->
      <div
        class="zv-play-title-cover-div"
        :class="{ 'zv-play-hide-title-div': hideCont }"
        @mouseover="fromChild = true"
      >
        <p v-if="titlep" class="zv-play-title-p">{{ titlep }}</p>
        <div v-if="isShowBack" class="back-btn-div" @click="backClick">
          <i class="font_family icon-fanhui2"></i>
          <span v-if="backText" class="zv-play-back-text-span">{{
            backText
          }}</span>
        </div>
        <slot name="title"></slot>
      </div>
      <!-- 内容区 -->
      <div
        class="zv-play-cont-main-div"
        :class="{
          'zv-play-static-lower-height-div':
            changeCont && isStatic && !hideCont,
          'zv-play-lower-height-div': changeCont && !isStatic && !hideCont
        }"
      >
        <slot name="mainCont"></slot>
      </div>
      <!-- 底部操作区 -->
      <div
        class="zv-play-control-div"
        :class="{
          'is-for-static-show': isStatic,
          'zv-play-static-hide-control': isStatic && hideCont,
          'zv-play-hide-control': !isStatic && hideCont
        }"
        @mouseover="fromChild = true"
      >
        <!-- 全屏按钮 -->
        <span class="zv-play-fullpage-control-span" @click="toggleFullScreen">
          <i
            class="iconfont-video"
            :class="isFullpage ? 'iconshouqiquanping' : 'iconquanping'"
          ></i>
        </span>
        <!-- 其他操作按钮 -->
        <div class="zv-play-control-item-div">
          <slot name="controlCont"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZvPlayLayout',
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
    // 区分音频视频、图文pdf，false为音频视频 true为图文pdf
    isStatic: {
      type: Boolean,
      default() {
        return false
      }
    },
    isShowBack: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 返回按钮事件
    backFn: {
      type: Function,
      default() {
        // console.log(this, 123)
        const _this = this
        return (function defaultfn() {
          console.log(7410, this)
          _this.$router.back()
        })()
      }
    },
    // 内容区是否跟随底部控制区显示与隐藏而改变
    changeCont: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      hideSide: false, // 隐藏右侧栏
      hideCont: false, // 隐藏标题和控制栏
      isFullpage: false, // 是否全屏
      countTimer: null, // 定时器
      fromChild: false
    }
  },
  mounted() {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        console.log('进入全屏123')
        this.isFullpage = true
        this.$emit('openFullPage')
      } else {
        console.log('退出全屏23324')
        this.isFullpage = false
        this.$emit('exitFullPage')
      }
    })
    // setTimeout(() => {
    //   this.hideCont = true
    // }, 3000)
  },
  destroyed() {
    document.removeEventListener('fullscreenchange', () => {})
  },
  methods: {
    // 1.进入全屏

    fullIn(ele) {
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen()
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen()
      }
      this.isFullpage = true
    },
    // 2.exitFullScreen退出全屏

    exitFullscreen() {
      if (document.exitFullScreen) {
        document.exitFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.isFullpage = false
    },
    // 3.获取当前全屏的节点
    getFullscreenElement() {
      return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullScreenElement ||
        document.webkitFullscreenElement ||
        null
      )
    },
    // 4.判断当前是否全屏
    isFullScreen() {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      )
    },
    // 5.判断当前文档是否能切换到全屏
    isFullscreenEnabled() {
      return (
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled
      )
    },
    // 全屏按钮
    toggleFullScreen() {
      if (this.isFullscreenEnabled() && !this.isFullScreen()) {
        const fullDom = this.$refs.mediumViews
        this.fullIn(fullDom)
      } else this.exitFullscreen()
    },
    // 鼠标移入内容区
    contHandleMouseover() {
      if (this.fromChild) {
        return
      }
      this.hideCont = false
      this.fromChild = false
      clearTimeout(this.countTimer)
      this.countTimer = setTimeout(() => {
        this.hideCont = true
      }, 3000)
    },

    // 鼠标离开内容区
    contHandleMouseOut() {
      clearTimeout(this.countTimer)
      this.countTimer = setTimeout(() => {
        this.hideCont = true
      }, 3000)
    },

    // 鼠标在内容区移动
    contHandleMouseMove() {
      this.hideCont = false
      clearTimeout(this.countTimer)
      this.countTimer = setTimeout(() => {
        this.hideCont = true
      }, 3000)
    },

    // 默认返回事件
    // defaultFn() {
    //   this.$router.back()
    // },

    // 返回事件
    backClick() {
      // console.log(8520, this.backFn)
      this.backFn()
    },

    // 右侧控制部分
    handleSideControl() {
      this.hideSide = !this.hideSide
      this.$emit('rightChange', this.hideSide)
    }
  }
}
</script>
<style lang="scss" scoped>
.zv-play-layout-div {
	::-webkit-scrollbar {
		width: 4px;
		height: 4px;
		background: rgba($color: #fff, $alpha: 1);
	}
	::-webkit-scrollbar-thumb {
		background: #959ba5;
		border-radius: 2px;
	}

	position: absolute;
	width: 100%;
	height: 100%;
	// top: 0;
	// left: 0;
	padding-right: 400px;
	transition: all linear 0.3s;
	.zv-play-right-cont {
		position: absolute;
		top: 0;
		right: 0;
		width: 400px;
		height: 100%;
		// background: red;
		overflow: hidden;
		// background: red;
		transition: all linear 0.3s;
	}
	.zv-side-control-span {
		position: absolute;
		top: 0;
		right: 400px;
		z-index: 11;
		display: block;
		width: 32px;
		height: 56px;
		font-size: 17px;
		line-height: 56px;
		color: #fff;
		text-align: center;
		cursor: pointer;
		background: #333;
		transition: all linear 0.3s;
	}
	.zv-play-cont-div {
		// transition: all linear 0.3s;
		position: relative;
		height: 100%;
		overflow: hidden;
		background: rgba($color: #000, $alpha: 0.3);
	}
	.zv-play-title-cover-div {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 75px;
		overflow: hidden;
		background: #000;
		transition: all 0.3s linear;
	}
	.zv-play-hide-title-div {
		top: -75px;
	}
	.zv-play-title-p {
		height: 75px;
		margin: 0;
		font-size: 18px;
		line-height: 75px;
		color: #fff;
		text-align: center;
	}
	.back-btn-div {
		position: absolute;
		top: 50%;
		left: 24px;
		height: 24px;
		margin-top: -12px;
		font-size: 16px;
		line-height: 24px;
		color: #3385ff;
		vertical-align: top;
		cursor: pointer;
		i {
			float: left;
			font-size: 24px;
		}
	}
	.zv-play-back-text-span {
		margin-left: 4px;
	}
	.zv-play-cont-main-div {
		position: relative;
		height: 100%;
		padding-top: 0;
		padding-bottom: 0;
		transition: all linear 0.3s;
	}
	.zv-play-lower-height-div {
		padding-top: 75px;
		padding-bottom: 65px;
	}
	.zv-play-static-lower-height-div {
		padding-top: 75px;
		padding-bottom: 52px;
	}
	.zv-play-control-div {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 65px;
		overflow: hidden;
		background: rgba($color: #000, $alpha: 0.8);
		transition: all 0.3s linear;
		// padding-right: 52px;
		i {
			font-size: 20px;
			color: #fff;
			cursor: pointer;
		}
	}
	.is-for-static-show {
		height: 52px;
		.zv-play-fullpage-control-span {
			top: 16px;
		}
	}
	.zv-play-fullpage-control-span {
		position: absolute;
		top: 32px;
		right: 32px;
		z-index: 12;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		transition: all 0.3s linear;
		transform: scale(1);
		&:hover {
			transform: scale(1.1);
		}
	}
	.zv-play-static-hide-control {
		bottom: -52px;
	}
	.zv-play-hide-control {
		bottom: -50px;
	}
	.zv-play-control-item-div {
		position: relative;
		height: 100%;
	}
}
.zv-play-hide-side {
	padding-right: 0;
	.zv-play-right-cont {
		width: 0;
	}
	.zv-side-control-span {
		right: 0;
	}
}
</style>
