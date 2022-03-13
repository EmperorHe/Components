import store from '@/store'
import moment from 'moment'
// import Vue from 'vue'
// import {  } from '@/store/mutation-types'

/**
 * 系统工具类函数集合
 */
// 将路径转化为首字母大写帕斯卡（大驼峰）命名形式
export function tranformUrlCamelCase(str) {
  let arr = []
  const strArr = str.split('/')
  strArr.map(o => {
    const result = o.split('-')
    arr = [...arr, ...result]
  })
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1)
  }
  return arr.join('')
}

// 根据"/"切割URL地址
export function splitUrl(url) {
  const arr = url.split('/')
  const newArr = []
  let temp = ''
  for (let i = 0; i < arr.length; i++) {
    temp += (i === 1 ? '' : '/') + arr[i]
    newArr.push(temp)
  }
  newArr.pop()
  return newArr
}

// 将数组用某个连接符拼为字符串
export function arrJoinStr(arr, Symbol, key) {
  let str = ''
  arr.map((item, index) => {
    if (key) {
      str += index === 0 ? item[key] : Symbol + item[key]
    } else {
      str += index === 0 ? item : Symbol + item
    }
  })
  return str
}

// 触发window.resize
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

// 触发document的click事件
export function triggerDocumentClickEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('click', true, true)
  event.eventType = 'message'
  document.dispatchEvent(event)
  console.log('触发了')
}

// 判断一个对象是否为json格式
export function isJson(obj) {
  var isjson =
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj).toLowerCase() === '[object object]' &&
    !obj.length
  return isjson
}

// 移除菜单树空的children
export function removeNullChildren(data) {
  const result = []
  data.map(item => {
    const json = {}
    for (const key in item) {
      if (key === 'children') {
        if (Array.isArray(item[key]) && item[key].length > 0) {
          json[key] = removeNullChildren(item[key])
        }
      } else {
        json[key] = item[key]
      }
    }
    result.push(json)
  })
  return result
}

// 根据部门id在部门树中检索输出中文名
export function filterCompanyName(tree, id) {
  let name = ''
  let temp = ''
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].key === id) {
      name = tree[i].title
      break
    }
    if (tree[i].children && tree[i].children.length > 0) {
      temp = filterCompanyName(tree[i].children, id)
      if (temp) {
        name = temp
        break
      }
    }
  }
  return name
}

// 获取某元素以浏览器左上角为原点的坐标
export function getPoint(obj) {
  var t = obj ? obj.offsetTop : 0 // 获取该元素对应父容器的上边距
  var l = obj ? obj.offsetLeft : 0 // 对应父容器的上边距
  // 判断是否有父容器，如果存在则累加其边距
  if (obj) {
    while ((obj = obj.offsetParent)) {
      // 等效 obj = obj.offsetParent;while (obj != undefined)
      t += obj.offsetTop // 叠加父容器的上边距
      l += obj.offsetLeft // 叠加父容器的左边距
    }
  }
  return {
    left: l,
    top: t
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 毫秒数转字符串（格式：YYYY-MM-DD hh:mm:ss）
export function millisSecondToStr(val, format) {
  let secondStr = ''
  let secondFormat = ''
  if (format === '' || format == null) {
    secondFormat = 'YYYY-MM-DD hh:mm:ss'
  } else {
    secondFormat = format
  }
  secondStr = moment(val).format(secondFormat)
  return secondStr
}

// 毫秒数转x天x小时x分x秒
export function millisSecondToDuration(val) {
  let timeStr = ''
  const duration = moment.duration(val)
  if (duration.days() !== 0) {
    timeStr += duration.days() + '天'
  }
  if (duration.hours() !== 0) {
    timeStr += duration.hours() + '小时'
  }
  if (duration.minutes() !== 0) {
    timeStr += duration.minutes() + '分'
  }
  if (duration.seconds() !== 0) {
    timeStr += duration.seconds() + '秒'
  }
  return timeStr
}

// 转换字符串，null等转化为"nullString"
export function ifNull(origin, nullString = '') {
  if (origin == null) {
    return nullString
  }
  return origin
}

/**
 * 获取url上的所有参数
 * @param {string} url URL字符串
 * @returns {object}
 */
export function getAllUrlParams(url) {
  // get query string from url (optional) or window
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1)

  // we'll store the parameters here
  var obj = {}

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0]

    // split our query string into its component parts
    var arr = queryString.split('&')
    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=')
      // in case params look like: list[]=thing1&amp;list[]=thing2
      let paramNum
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1, -1)
        return ''
      })
      // set parameter value (use 'true' if empty)
      var paramValue = typeof a[1] === 'undefined' ? true : a[1]
      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]]
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue)
        } else {
          // if array index number specified...
          // put the value at that index number
          obj[paramName][paramNum] = paramValue
        }
      } else {
        // if param name doesn't exist yet, set it
        obj[paramName] = paramValue
      }
    }
  }
  return obj
}

/**
 * 对象深拷贝
 * @param {object} obj 要拷贝的对象
 * @returns {object}
 */
export function cloneObj(obj) {
  let str
  let newObj = obj.constructor === Array ? [] : {}
  if (
    Object.prototype.toString.call(obj) !== '[object Object]' &&
    Object.prototype.toString.call(obj) !== '[object Array]'
  ) {
    return
  } else if (window.JSON) {
    str = JSON.stringify(obj) // 系列化对象
    newObj = JSON.parse(str) // 还原
  } else {
    for (const i in obj) {
      newObj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i]
    }
  }
  return newObj
}
// 深拷贝
export function deepCopy(newObj, oldObj) {
  for (var k in oldObj) {
    var item = oldObj[k]
    if (Object.prototype.toString.call(item) === '[object Array]') {
      newObj[k] = []
      deepCopy(newObj[k], item)
    } else if (Object.prototype.toString.call(item) === '[object Object]') {
      newObj[k] = {}
      deepCopy(newObj[k], item)
    } else {
      newObj[k] = item
    }
  }
}

/**
 *
 * @param {*} data blod文件流
 * @param {*} name 下载后的文件名称
 */
export function downloadBlob(data, name) {
  const blob = new Blob([data])
  const fileName = name
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

// 字符串转unit8Array
export function char2buf(str) {
  var out = new ArrayBuffer(str.length)
  var u16a = new Uint8Array(out)
  var strs = str.split('')
  for (var i = 0; i < strs.length; i++) {
    u16a[i] = strs[i].charCodeAt()
  }
  return u16a
}

/**
 * 获取窗口可视范围高度
 */
export function getClientHeight() {
  var clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}

/**
 * 递归处理多余的 layout : <router-view>，
 * 让需要访问的组件保持在第一层 index : <router-view> 之下
 * @param to
 */
export function handleKeepAlive(to) {
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'RouteView') {
        to.matched.splice(i, 1)
        handleKeepAlive(to)
      }
    }
  }
}

/**
 * 判断是否要系统显示头部和侧边导航栏
 * url参数中携带onlyMain参数，值为1则显示主模块，不为1则显示全部系统。
 * @param to
 */
export function handleShowNav(to) {
  if (
    (to.query.onlyMain && to.query.onlyMain === '1') ||
    window.self !== window.top
  ) {
    store.commit('SET_ONLY_MAIN', true)
  } else {
    store.commit('SET_ONLY_MAIN', false)
  }
}

/**
 * 将路由变成一维路由
 */
export function adjustRouter(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    const json = {}
    for (const k in arr[i]) {
      if (k !== 'children') {
        json[k] = arr[i][k]
      }
    }
    result.push(json)
    if (arr[i].children && arr[i].children.length > 0) {
      result = [...result, ...adjustRouter(arr[i].children)]
    }
  }
  return result
}

/**
 * 保留n位小数
 * @param {*} value 待转换的数
 * @param {*} n  保留的小数个数
 */
export function roundNum(value, n) {
  if (
    value.toString().indexOf('.') > -1 &&
    value.toString().split('.')[1].length >= n
  ) {
    return value.toFixed(n)
  } else {
    return value
  }
}

/**
 * 获取文件类型
 * @param {*} suffix 文件后缀
 */
export function fileType(suffix) {
  const suffix_name = suffix.toLowerCase()
  console.log(suffix_name)
  const video = [
    '.asx',
    '.asf',
    '.mpg',
    '.wmv',
    '.3gp',
    '.mov',
    '.avi',
    '.flv',
    '.swf',
    '.mp4'
  ]
  const audio = ['.mp3']
  const pdf = ['.pdf']
  const image = ['.png', '.gif', '.jpg', '.bmp', '.jpeg']
  const html = ['.html']
  const zip = ['.zip', '.rar']
  const tiff = ['.tiff', '.tif']
  if (video.includes(suffix_name)) {
    return 'video'
  } else if (audio.includes(suffix_name)) {
    return 'audio'
  } else if (pdf.includes(suffix_name)) {
    return 'pdf'
  } else if (image.includes(suffix_name)) {
    return 'image'
  } else if (html.includes(suffix_name)) {
    return 'html'
  } else if (zip.includes(suffix_name)) {
    return 'zip'
  } else if (tiff.includes(suffix_name)) {
    return 'tiff'
  } else {
    return 'unknown'
  }
}

/**
 * 生成全局唯一标识id
 */
export function generateUUID() {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
};
