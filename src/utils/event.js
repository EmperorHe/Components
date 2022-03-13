// 事件绑定
export function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false)
  } else if (element.attachEvent) {
    // 对ie进行判断
    element.attachEvent('on' + type, handler)
  } else {
    //
    element['on' + type] + handler
  }
  return handler
}

// 事件解绑
export function offEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false)
  } else if (element.detachEvent) {
    // detachEvent是ie的事件监听
    element.detachEvent('on' + type, handler)
  } else {
    element['on' + type] = null
  }
}

// 获取事件对象
export function getEvent(event) {
  return event || window.event
}

// 获取事件类型
export function getType(event) {
  return event.type
}

// 获取事件的节点
export function getElement(event) {
  return event.target || event.srcElement
}

// 阻止事件冒泡
export function preventDefualt(event) {
  if (event.preventDefault) {
    event.preventDefault
  } else {
    event.returnValue = false
  }
}

// 阻止事件默认行为
export function stopPropagation(event) {
  if (event.stopPrapagation) {
    event.stopPropagation()
  } else {
    event.cancelbubble = true
  }
}

const isHaveEle = (obj, ele) => {
  let el = ele || null
  let state = false
  while (el) {
    if (el === window.top) {
      break
    } else if (el === obj) {
      state = true
      break
    }
    el = el.parentElement
  }
  return state
}

const mouseEvent = {
  _handler: null,
  onWheel(opt) {
    // console.log(opt)
    if (!opt.target) {
      console.log('什么都没有，还让我帮忙！')
      return
    }
    const callback = opt.callback || function() {}
    const target = opt.target

    // 获取兼容事件
    const mouseWheel = /Firefox/i.test(navigator.userAgent)
      ? 'DOMMouseScroll'
      : 'mousewheel'

    this._handler = addEvent(document, mouseWheel, e => {
      if (isHaveEle(target, e.target)) {
        if (e.detail) {
          // FF
          callback(e, e.detail * 40)
        } else {
          callback(e, e.wheelDelta)
        }
      }
    })
  },
  offWheel() {
    // 获取兼容事件
    const mouseWheel = /Firefox/i.test(navigator.userAgent)
      ? 'DOMMouseScroll'
      : 'mousewheel'
    offEvent(document, mouseWheel, this._handler)
  }
}

export { mouseEvent }
