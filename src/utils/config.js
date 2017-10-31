const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

let APIBG = '/api/bg'

if (document.domain === 'betabia.banggood.com') {
	// 测试
	APIBG = 'https://betabia.banggood.com/index.php';
}
else if(document.domain === 'localhost'){
	// 本地
	APIBG = '/api/bg';
}
else if(document.domain === 'localbia.banggood.com'){
	// 测试
	APIBG = 'http://localbia.banggood.com/index.php';
}
else{
	// 正式环境
	APIBG = 'https://bia.banggood.com/index.php';
}

module.exports = {
  name: '情报源',
  prefix: '情报源',
  footerText: 'Copyright © 2006-2017 Banggood Ltd. All Rights Reserved.  版权所有为广州棒谷网络科技有限公司 粤ICP备15016191号',
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
  CODE200:200,
}
