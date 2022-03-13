import configIcon from '@/config/menuIcon'
import { splitUrl } from '@/utils/utils'
import Menu from 'ant-design-vue/es/menu'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    keyword: {
      type: String,
      default() {
        return ''
      }
    },
    defaultOpenKeys: {
      type: Array,
      default() {
        return []
      }
    },
    miniMenu: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted() {
    this.updateMenu()
  },
  watch: {
    collapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route() {
      // 左侧菜单点击触发
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange(openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu() {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      const openRoutes = splitUrl(routes[routes.length - 1].path)
      if (this.$route.meta.hidden) {
        this.selectedKeys = [this.$route.meta.crumbs[this.$route.meta.crumbs.length - 2].url]
      } else if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      let openKeys = []
      if (this.mode === 'inline') {
        // 侧边菜单模式
        openRoutes.forEach(item => {
          openKeys.push(item)
        })
        if (this.defaultOpenKeys.length > 0) {
          openKeys = openKeys.concat(this.defaultOpenKeys)
          openKeys = Array.from(new Set(openKeys))
        }
      }
      // update-begin-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
      if (!this.selectedKeys || this.selectedKeys[0].indexOf(':') < 0) {
        this.collapsed
          ? (this.cachedOpenKeys = openKeys)
          : (this.openKeys = openKeys)
      }
      // update-end-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
    },

    // render
    renderItem(menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu
          ? this.renderSubMenu(menu)
          : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem(menu) {
      const target = menu.meta.target || null
      const tag = (target && 'a') || 'router-link'
      let props = {
        to: { name: menu.name }
      }
      if (menu.route && menu.route === '0') {
        props = {
          to: { path: menu.path }
        }
      }

      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }

      return (
        <Item
          {...{
            key: menu.path
          }}
        >
          <tag
            {...{
              props,
              attrs
            }}
          >
            {this.renderIcon(menu.meta.icon)}
            <span style={`"vertical-align: middle;"`}> {menu.meta.title} </span>
          </tag>
        </Item>
      )
    },
    renderSubMenu(menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      const on = {
        // mouseenter: $event => {
        //   //console.log($event)
        // }
      }
      return (
        <SubMenu
          {...{
            key: menu.path
          }}
          {...{
            on: on
          }}
        >
          <span slot={'title'}>
            {this.renderIcon(menu.meta.icon)}
            <span style={'vertical-align: middle;'}> {menu.meta.title} </span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon(icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof icon === 'object' ? (props.component = icon) : (props.type = icon)
      return (
        // <Icon {... { props }} />
        <span
          class={'font_family'}
          style={'margin-right: 6px; vertical-align: middle;'}
          domPropsInnerHTML={configIcon[icon]}
        >
          {' '}
        </span>
      )
    }
  },

  render() {
    const { mode, theme, menu, miniMenu } = this
    let props = {}
    if (mode === 'inline') {
      // 进入侧边菜单模式
      props = {
        mode: mode,
        theme: theme,
        inlineCollapsed: miniMenu,
        subMenuOpenDelay: 1,
        openKeys: this.openKeys
      }
    } else {
      // 进入顶部菜单模式
      props = {
        mode: mode,
        theme: theme,
        subMenuOpenDelay: 1,
        openKeys: this.openKeys
      }
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu
        vModel={this.selectedKeys}
        {...{
          props,
          on: on
        }}
      >
        {menuTree}
      </Menu>
    )
  }
}
