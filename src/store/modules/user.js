const user = {
  state: {
    // 用户登录令牌
    token: '',
    // 用户信息
    userInfo: {},
    // 系统菜单
    menus: [],
    // 用户按钮权限
    roleBtns: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_REFRASH_TOKEN(state, token) {
      state.refresh_token = token
    },
    SET_USERINFO(state, data) {
      state.userInfo = data
    },
    SET_ROLES(state, roles) {
      state.roles = roles
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_USERBTNS(state, btns) {
      state.roleBtns = btns
    }
  }
}

export default user
