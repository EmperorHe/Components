<template>
  <a-config-provider :locale="locale">
    <div id="app" :class="{ 'app-mask': appMask }">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapGetters } from 'vuex'
import { addEvent } from '@/utils/event'

export default {
  data() {
    return {
      locale: zhCN,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['appMask'])
  },
  mounted() {
    this.$nextTick(() => {
      addEvent(window, 'resize', () => {
        this.resizeHandle()
      })
    })
  },
  created() {
    console.log(
      `[环境变量]当前主环境为：${process.env.NODE_ENV} 分支环境为：${process.env.VUE_APP_BRANCH_ENV}`
    )
  },
  methods: {
    resizeHandle() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setWidthHeight()
        this.$bus.emit('resize')
      }, 500)
    },
    setWidthHeight() {
      const w = document.documentElement.clientWidth
      const h = document.documentElement.clientHeight
      console.log(w, h)
      this.$store.commit('SET_WIN_WIDTH', w)
      this.$store.commit('SET_WIN_HEIGHT', h)
    }
  }
}
</script>

<style lang="scss">
#app {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #f2f2f2;
	&.app-mask {
		&::after {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
			display: block;
			width: 100%;
			height: 100%;
			content: '';
		}
	}
}
</style>
