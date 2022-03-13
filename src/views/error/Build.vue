<template>
  <div
    ref="wrap"
    class="build-wrap"
    :style="{
      height: height + 'px'
    }"
  >
    <div class="cell">
      <div class="build-mode">
        <img src="~@/assets/images/error-page/icon-1.png" class="icon" />
        <div class="cont">
          <p class="title">Sorry</p>
          <p class="main-t">项目正在开发中，敬请期待！</p>
          <p class="tips">我们竭尽全力展现最好的产品给您。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentNode: null,
      height: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.parentNode = this.$refs['wrap'].parentNode
      this.height = this.parentNode.offsetHeight
      console.log(this.height)
    })
  }
}
</script>

<style lang="scss" scoped>
.build-wrap {
	position: relative;
	display: table;
	width: 100%;
	min-height: 300px;
	.cell {
		display: table-cell;
		text-align: center;
		vertical-align: middle;
	}
}
.build-mode {
	position: relative;
	display: inline-block;
	height: 224px;
	padding: 27px 10px 0 292px;
	text-align: left;
}
.icon {
	position: absolute;
	top: 0;
	left: 0;
	width: 216px;
}
.cont {
	.title {
		margin-bottom: 20px;
		font-family: 'Arial';
		font-size: 40px;
		font-weight: bold;
		color: #a5bcf8;
		background-image: -webkit-linear-gradient(bottom, #7791fa, #a3c8ff);
		-webkit-background-clip: text;
		-o-background-clip: text;
		background-clip: text;
		-o-ms-clip: text;
		-webkit-text-fill-color: transparent;
	}

	position: relative;
	.main-t {
		margin-bottom: 26px;
		font-size: 24px;
	}
	.tips {
		line-height: 1.5;
		color: #999;
	}
}
</style>
