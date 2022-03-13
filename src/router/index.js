import Vue from 'vue'
import Router from 'vue-router'
import { baseRouterMap } from './routerConfig'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'hash',
  // mode: 'history', // cas 需要开启否则死循环
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: baseRouterMap
})
