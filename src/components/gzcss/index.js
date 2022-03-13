import Vue from 'vue'

function changeStr(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const requireComponent = require.context('./', false, /\.vue$/)

// 查找同级目录下以vue结尾的组件
const install = () => {
  requireComponent.keys().forEach(fileName => {
    const config = requireComponent(fileName)
    // console.log(config) // ./child1.vue 然后用正则拿到child1
    const componentName = changeStr(
      fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    )
    Vue.component(componentName, config.default || config)
  })
}

export default {
  install // 对外暴露install方法
}
