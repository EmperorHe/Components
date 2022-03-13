<template>
  <div class="zv-router-view-main">
    <transition v-if="animate" name="zv-transition-animate" mode="out-in">
      <router-view />
    </transition>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RouteView',
  data() {
    return {
      excludeList: []
    }
  },
  computed: {
    ...mapState({
      animate: state => state.app.animate, // 转场动画
      browserName: state => state.app.browserName
    })
  }
}
</script>

<style lang="scss">
.zv-router-view-main {
	position: relative;
	width: 100%;
	height: 100%;
}
</style>
