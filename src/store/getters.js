const getters = {
  loginType: state => state.app.loginType,
  menus: state => state.user.menus,
  roleBtns: state => state.user.roleBtns,
  userId: state => state.user.userInfo.userId,
  username: state => state.user.userInfo.username,
  realname: state => state.user.userInfo.realName,
  avatar: state => state.user.userInfo.avatar,
  appMask: state => state.app.appMask,
  browserName: state => state.app.browserName,
  browserVersion: state => state.app.browserVersion,
  pageList: state => state.app.pageList,
  isCloseHandle: state => state.app.isCloseHandle,
  onlyMain: state => state.app.onlyMain,
  clientWidth: state => state.app.clientWidth,
  clientHeight: state => state.app.clientHeight
}

export default getters
