import { request, config } from 'utils'

const { api } = config
const { menus } = api

export async function query (params) {
  return request({
    url: menus,
    method: 'get',
    data: params,
  }) 
}


export async function menuData (params) {

  const data = [
    
    /* {"id":"1","icon":"laptop","name":"首页","route":"/home"},
    {"id":"1002","icon":"shopping-cart","name":"商品","route":"/goods"},
    {"id":"10021","mpid":"-1","bpid":"1002","name":"创建关系","route":"/goods/relevance"},
    {"id":"10022","mpid":"-1","bpid":"1002","name":"创建关系","route":"/goods/relevance/:id"},
    {"id":"10031","mpid":"-1","bpid":"1002","name":"详情","route":"/goods/detail/:id"}, */ 

    /* {"id":"1003","icon":"search","name":"竞品","route":"/rival/new"},
    {"id":"10031","bpid":"1003","mpid":"1003","name":"竞品新品","icon":"compass","route":"/rival/new"},
    {"id":"100311","bpid":"1003","mpid":"-1","name":"新品列表","route":"/rival/view"},
    {"id":"10032","bpid":"1003","mpid":"1003","name":"竞品热销","icon":"heart-o","route":"/rival/hot"},
    {"id":"10033","bpid":"1003","mpid":"1003","name":"竞品热论","icon":"team","route":"/rival/talk"},
    {"id":"10034","bpid":"1003","mpid":"1003","name":"竞品推荐","icon":"like-o","route":"/rival/recommend"},
    {"id":"1004","icon":"bars","name":"分类","route":"/class"},
    {"id":"1005","icon":"area-chart","name":"品牌","route":"/brand"}, */

    {"id":"1","name":"竞品新品","icon":"compass","route":"/rival/new"},
    {"id":"101","mpid":"-1","bpid":"1","name":"竞品列表","route":"/rival/view"},
    {"id":"2","name":"竞品热销","icon":"heart-o","route":"/rival/hot"},
    { "id": "21", "bpid": "2", "mpid": "2", "name": "品类分布", "route": "/rival/hot" },
    { "id": "22", "bpid": "2", "mpid": "2", "name": "价格分布", "route": "/rival/hot/price" },
    { "id": "23", "bpid": "2", "mpid": "2", "name": "热销排行", "route": "/rival/hot/rank" },

    {"id":"3","name":"竞品热论","icon":"team","route":"/rival/talk"},
    {"id":"4","name":"竞品追踪","icon":"like-o","route":"/rival/recommend"},
    
    
    /* {"id":"1","icon":"laptop","name":"Dashboard","route":"/dashboard"},
    {"id":"2","bpid":"1","name":"Users","icon":"user","route":"/user"},
    {"id":"21","mpid":"-1","bpid":"2","name":"User Detail","route":"/user/:id"},
    {"id":"7","bpid":"1","name":"Posts","icon":"shopping-cart","route":"/post"},
    {"id":"3","bpid":"1","name":"Request","icon":"api","route":"/request"},

    {"id":"4","bpid":"1","name":"UI Element","icon":"camera-o"},
    {"id":"41","bpid":"4","mpid":"4","name":"IconFont","icon":"heart-o","route":"/UIElement/iconfont"},
    {"id":"42","bpid":"4","mpid":"4","name":"DataTable","icon":"database","route":"/UIElement/dataTable"},
    {"id":"43","bpid":"4","mpid":"4","name":"DropOption","icon":"bars","route":"/UIElement/dropOption"},
    {"id":"44","bpid":"4","mpid":"4","name":"Search","icon":"search","route":"/UIElement/search"},
    {"id":"45","bpid":"4","mpid":"4","name":"Editor","icon":"edit","route":"/UIElement/editor"},
    {"id":"46","bpid":"4","mpid":"4","name":"layer (Function)","icon":"credit-card","route":"/UIElement/layer"},
    {"id":"5","bpid":"1","name":"Recharts","icon":"code-o"},
    {"id":"51","bpid":"5","mpid":"5","name":"LineChart","icon":"line-chart","route":"/chart/lineChart"},
    {"id":"52","bpid":"5","mpid":"5","name":"BarChart","icon":"bar-chart","route":"/chart/barChart"},
    {"id":"53","bpid":"5","mpid":"5","name":"AreaChart","icon":"area-chart","route":"/chart/areaChart"},
    {"id":"6","bpid":"1","name":"Test Navigation","icon":"setting"},
    {"id":"61","bpid":"6","mpid":"6","name":"Test Navigation1","route":"/navigation/navigation1"},
    {"id":"62","bpid":"6","mpid":"6","name":"Test Navigation2","route":"/navigation/navigation2"},
    {"id":"621","bpid":"62","mpid":"62","name":"Test Navigation21","route":"/navigation/navigation2/navigation1"},
    {"id":"622","bpid":"62","mpid":"62","name":"Test Navigation22","route":"/navigation/navigation2/navigation2"},  */

  
  ];

  return data;
}