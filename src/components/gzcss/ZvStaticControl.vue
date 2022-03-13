<template>
  <div class="zv-static-control">
    <!-- 输入页数 -->
    <div
      v-if="showInput"
      class="zv-static-page-change-div"
      :style="type === 'no' ? 'right: 75px' : ''"
    >
      <div class="zv-static-page-input-cover-div">
        <a-input
          ref="myinput"
          v-model="currPage"
          class="for-page-input"
          @focus="handleFocus"
          @blur="handleBlur"
          @pressEnter="handleEnterPress"
        />
      </div>
      <span class="zv-static-total-span">/{{ totalPage }}</span>
    </div>
    <!-- 放大按钮 -->
    <span
      v-if="type === 'main'"
      class="zv-static-common-icon-span zv-static-kuoda-icon"
      @click="enlargeClick"
    >
      <i class="iconfont-video iconfangda"></i>
    </span>
    <!-- 缩小按钮 -->
    <span
      v-if="type === 'main'"
      class="zv-static-common-icon-span zv-static-suoxiao-icon"
      @click="miniClick"
    >
      <i class="iconfont-video iconsuoxiao"></i>
    </span>
  </div>
</template>
<script>
const scaleArr = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3]
export default {
  name: 'ZvStaticControl',
  props: {
    totalPage: {
      type: Number,
      default() {
        return 1
      }
    },
    type: {
      type: String,
      default() {
        return 'main'
      }
    },
    setPage: {
      type: Number,
      default() {
        return 0
      }
    },
    showInput: {
      type: Boolean,
      default() {
        return false
      }
    },
    showScale: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      currScale: 3, // 倍数位置，默认为1
      totalLen: scaleArr.length,
      beforePage: 1,
      currPage: 1
    }
  },
  watch: {
    setPage(newv) {
      this.currPage = newv
    }
  },
  methods: {
    // 缩小按钮
    miniClick() {
      this.currScale--
      if (this.currScale < 0) {
        this.currScale = 0
      }
      this.$emit('changeScale', scaleArr[this.currScale])
    },

    // 放大按钮20%、50%、80%、100%、120%、150%、200%、300%
    enlargeClick() {
      this.currScale++
      console.log(this.currScale, 5666)
      if (this.currScale >= this.totalLen) {
        this.currScale = this.totalLen - 1
      }
      this.$emit('changeScale', scaleArr[this.currScale])
    },

    // 输入框获得焦点
    handleFocus() {
      this.beforePage = this.currPage
    },

    // 输入框失去焦点
    handleBlur() {
      console.log(this.currPage - 0)
      const _num = this.currPage - 0
      if (_num === 0 || _num > this.totalPage) {
        this.currPage = this.beforePage
      } else {
        console.log(_num, '提交')
        this.$emit('pageScroll', _num)
      }
    },

    // 输入框按下回车
    handleEnterPress() {
      this.$refs.myinput.blur()
    }
  }
}
</script>
<style lang="scss" scoped>
.zv-static-control {
	position: relative;
	height: 100%;
	.zv-static-common-icon-span {
		position: absolute;
		top: 16px;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		cursor: pointer;
		transition: all 0.3s linear;
		transform: scale(1);
		i {
			font-size: 20px;
			color: #fff;
		}
		&:hover {
			transform: scale(1.1);
		}
	}
	.zv-static-suoxiao-icon {
		right: 84px;
	}
	.zv-static-kuoda-icon {
		right: 136px;
	}
	.zv-static-page-change-div {
		position: absolute;
		top: 16px;
		right: 188px;
		height: 20px;
		line-height: 20px;
	}
	.zv-static-total-span {
		display: inline-block;
		height: 20px;
		font-size: 14px;
		line-height: 20px;
		color: #999;
	}
	.zv-static-page-input-cover-div {
		display: inline-block;
		margin-right: 4px;
	}
}
::v-deep {
	.for-page-input {
		width: 34px;
		height: 18px;
		min-height: 18px;
		padding: 0;
		font-size: 14px;
		color: #ebebeb;
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 3px;
	}
}
</style>
