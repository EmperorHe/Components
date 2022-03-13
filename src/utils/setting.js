import { message } from 'ant-design-vue/es'

let lessNodesAppended

const url = process.env.BASE_URL

const colorList = [
  {
    key: '红',
    color: '#d14d3f'
  },
  {
    key: '橙',
    color: '#f5a631'
  },
  {
    key: '绿',
    color: '#49b86e'
  },
  {
    key: '青',
    color: '#33bbd6'
  },
  {
    key: '紫',
    color: '#5e7aeb'
  },
  {
    key: '蓝（默认）',
    color: '#3296fa'
  }
]

const updateTheme = (primaryColor, size) => {
  // Don't compile less in production!
  /* if (process.env.NODE_ENV === 'production') {
    return;
  } */
  // Determine if the component is remounted
  console.log(primaryColor, size)
  if (!primaryColor && !size) {
    return
  }
  const hideMessage = message.loading('正在编译主题！', 0)

  function buildIt() {
    if (!window.less) {
      return
    }
    setTimeout(() => {
      window.less
        .modifyVars({
          '@primary-color': primaryColor,
          '@font-size-base': size
        })
        .then(() => {
          hideMessage()
        })
        .catch(() => {
          message.error('Failed to update theme')
          hideMessage()
        })
    }, 200)
  }

  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link')
    const lessConfigNode = document.createElement('script')
    const lessScriptNode = document.createElement('script')
    lessStyleNode.setAttribute('rel', 'stylesheet/less')
    lessStyleNode.setAttribute('href', `${url}color.less`)
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `
    // lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
    lessScriptNode.src = `${url}less.min-3.8.1.js`
    lessScriptNode.async = true
    lessScriptNode.onload = () => {
      buildIt()
      lessScriptNode.onload = null
    }
    document.body.appendChild(lessStyleNode)
    document.body.appendChild(lessConfigNode)
    document.body.appendChild(lessScriptNode)
    lessNodesAppended = true
  } else {
    buildIt()
  }
}

const updateColorWeak = colorWeak => {
  // document.body.className = colorWeak ? 'colorWeak' : '';
  colorWeak
    ? document.body.classList.add('colorWeak')
    : document.body.classList.remove('colorWeak')
}

export { updateTheme, colorList, updateColorWeak }
