<template>
  <div v-show="isShow" class="zv-load-wrap">
    <a-spin v-if="typeNum === 1" :spinning="isShow">
      <div slot="indicator" class="zv-load-spinner" :class="customClass">
        <svg viewBox="25 25 50 50" class="zv-load-circular" :style="styleObj">
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            class="zv-load-path"
            :stroke="color"
          />
        </svg>
        <div
          v-if="tipsText !== ''"
          class="zv-load-tips"
          :style="{ color: color }"
        >
          {{ tipsText }}
        </div>
      </div>
    </a-spin>
    <a-spin v-if="typeNum === 2" :spinning="isShow">
      <div slot="indicator" class="zv-load-spinner" :class="customClass">
        <div class="zv-load-1-mode" :class="customClass">
          <div :style="style2div1"></div>
          <div :style="style2div2"></div>
        </div>
        <div
          v-if="tipsText !== ''"
          class="zv-load-tips"
          :style="{ 'padding-top': '52px', color: color }"
        >
          {{ tipsText }}
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: 'ZvLoadWrap',
  props: {
    // loading的类型
    typeNum: {
      type: Number,
      default() {
        return 1
      }
    },
    // 是否显示
    isShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 大小
    size: {
      type: String,
      default() {
        return 'default'
      }
    },
    customClass: {
      type: String,
      default() {
        return ''
      }
    },
    color: {
      type: String,
      default() {
        return '#667aff'
      }
    },
    // 提示文本
    tipsText: {
      type: String,
      default() {
        return ''
      }
    }
  },
  computed: {
    width() {
      const o = {}
      switch (this.size) {
        case 'mini':
          o.width = '24px'
          o.height = '24px'
          break
        case 'small':
          o.width = '30px'
          o.height = '30px'
          break
        case 'large':
          o.width = '42px'
          o.height = '42px'
          break
        default:
          o.width = '34px'
          o.height = '34px'
          break
      }
      return o
    },
    styleObj() {
      return {
        ...this.width
      }
    },
    style2div1() {
      const o = {
        'border-color': this.color
      }
      switch (this.size) {
        case 'mini':
          o.width = '24px'
          o.height = '24px'
          break
        case 'small':
          o.width = '30px'
          o.height = '30px'
          break
        case 'large':
          o.width = '64px'
          o.height = '64px'
          break
        default:
          o.width = '52px'
          o.height = '52px'
          break
      }
      return o
    },
    style2div2() {
      const o = {
        'background-color': this.color
      }
      switch (this.size) {
        case 'mini':
          o.width = '12px'
          o.height = '12px'
          break
        case 'small':
          o.width = '15px'
          o.height = '15px'
          break
        case 'large':
          o.width = '32px'
          o.height = '32px'
          break
        default:
          o.width = '26px'
          o.height = '26px'
          break
      }
      return o
    }
  }
}
</script>

<style lang="scss" scoped>
.zv-load-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
// 第一种
.zv-load-spinner {
	position: absolute;
	top: 50%;
	width: 100%;
	text-align: center;
	transform: translateY(-50%);
	.zv-load-circular {
		animation: loading-rotate 2s linear infinite;
	}
	.zv-load-path {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: 0;
		stroke-linecap: round;
		stroke-width: 3;
		animation: loading-dash 1.5s ease-in-out infinite;
	}
}
.zv-load-tips {
	position: relative;
	padding-top: 5px;
	font-size: 14px;
}

@keyframes loading-rotate {
	to {
		transform: rotate(1turn);
	}
}

@keyframes loading-dash {
	0% {
		stroke-dasharray: 1, 200;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -40px;
	}
	to {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -120px;
	}
}
// 第二种
.zv-load-1-mode {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: block;
	width: 64px;
	height: 64px;
	margin: auto;
	font-size: 0;
	color: #fff;
}
.zv-load-1-mode > div:first-child {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 64px;
	height: 64px;
	margin: auto;
	background: 0 0;
	border-style: solid;
	border-width: 4px;
	border-right-color: transparent !important;
	border-left-color: transparent !important;
	-webkit-animation: ball-clip-rotate-pulse-rotate 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	-moz-animation: ball-clip-rotate-pulse-rotate 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	-o-animation: ball-clip-rotate-pulse-rotate 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	animation: ball-clip-rotate-pulse-rotate 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.zv-load-1-mode > div:last-child {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 32px;
	height: 32px;
	margin: auto;
	background-color: #fff;
	-webkit-animation: ball-clip-rotate-pulse-scale 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	-moz-animation: ball-clip-rotate-pulse-scale 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	-o-animation: ball-clip-rotate-pulse-scale 1s
		cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
	animation: ball-clip-rotate-pulse-scale 1s cubic-bezier(0.09, 0.57, 0.49, 0.9)
		infinite;
}
.zv-load-1-mode > div {
	position: absolute;
	display: inline-block;
	float: none;
	font-size: 0;
	color: #fff;
	border: 0 solid #fff;
	border-radius: 100%;
}

@-webkit-keyframes ball-clip-rotate-pulse-rotate {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	50% {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@-moz-keyframes ball-clip-rotate-pulse-rotate {
	0% {
		-moz-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	50% {
		-moz-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-moz-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@-o-keyframes ball-clip-rotate-pulse-rotate {
	0% {
		-o-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	50% {
		-o-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@keyframes ball-clip-rotate-pulse-rotate {
	0% {
		-webkit-transform: rotate(0deg);
		-moz-transform: rotate(0deg);
		-o-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	50% {
		-webkit-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		-moz-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@-webkit-keyframes ball-clip-rotate-pulse-scale {
	0%,
	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1);
	}
	30% {
		opacity: 0.3;
		-webkit-transform: scale(0.15);
		transform: scale(0.15);
	}
}

@-moz-keyframes ball-clip-rotate-pulse-scale {
	0%,
	100% {
		opacity: 1;
		-moz-transform: scale(1);
		transform: scale(1);
	}
	30% {
		opacity: 0.3;
		-moz-transform: scale(0.15);
		transform: scale(0.15);
	}
}

@-o-keyframes ball-clip-rotate-pulse-scale {
	0%,
	100% {
		opacity: 1;
		-o-transform: scale(1);
		transform: scale(1);
	}
	30% {
		opacity: 0.3;
		-o-transform: scale(0.15);
		transform: scale(0.15);
	}
}

@keyframes ball-clip-rotate-pulse-scale {
	0%,
	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		-moz-transform: scale(1);
		-o-transform: scale(1);
		transform: scale(1);
	}
	30% {
		opacity: 0.3;
		-webkit-transform: scale(0.15);
		-moz-transform: scale(0.15);
		-o-transform: scale(0.15);
		transform: scale(0.15);
	}
}
</style>
