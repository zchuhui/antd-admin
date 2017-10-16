const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const APIBG = '/api/bg'

module.exports = {
  name: '情报源系统',
  prefix: '情报源',
  footerText: 'Copyright 2017 RongCloud京公网安备 11010502027139京ICP备15042119号-1',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: { 
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  },
  apibg:APIBG,               // bg
  storageSaveTime: 60 * 24,  //分钟为单位
}
