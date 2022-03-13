import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'
import getters from './getters'

Vue.use(Vuex)

// 导入./modules文件夹下以.js结尾的分模块vuex
const modulesFiles = require.context('./modules', true, /\.js$/)

// 自动组装到modules对象中，并以模块js文件的命名为模块名称
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default new Vuex.Store({
  plugins: [
    createVuexAlong({
      // 设置保存的集合名字，避免同站点下的多项目数据冲突
      name: 'gzcss-vuex',
      local: {
        list: [
          'user.token',
          'user.menus',
          'user.roleBtns',
          'app.onlyMain',
          'permission.routeCache'
        ],
        isFilter: true // 过滤模块list中的字段数据， 将其他的存入localStorage
      }
    })
  ],
  modules,
  getters
})
