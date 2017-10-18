import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query, getCateList, getBrandList, getBgProductRunChart } from 'services/goods'
import { model } from 'models/common'
import Time from 'utils/time'

export default modelExtend(model, {
  namespace: 'goods',
  state: {
    
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/goods') {
          // 载入两个菜单
          dispatch({ type: 'getCateList' })
          dispatch({ type: 'getBrandList' })
        }
      })
    },
  },
  effects: {
    *query ({payload}, { call, put, select }) {
      yield put({type: 'updateState',payload: {'loading':true}})              // 加载状态

      const searchParams = yield select(state => state.goods.searchParams)    // 获取本地搜索参数
      const {data,code} = yield call(query, {...searchParams,...payload}) 

      // 数据格式转换
      data.list.map((item, index) => {
          // 添加key，不然会报错
          item['key_id'] = Math.random();
          if (item.relate_info) {
              let array = Object.keys(item.relate_info).map((el) => {
                  // 添加children标示
                  item.relate_info[el]['isChildren'] = 1;
                  return item.relate_info[el];
              });
              // 添加key，不然会报错
              array.map((item2,index2) => {
                  item2['key_id'] = Math.random();
              })
              item['children'] = array;
          }
      })
      
      yield put({
        type: 'updateState',
        payload: {...data,searchParams:{...data.search},'loading':false},
      })

    },

    *getCateList({payload},{ call, put}) {
      const {data,code} = yield call(getCateList, parse(payload));


      cateToMenu(data.banggood);
      
      yield put({
        type: 'updateState',
        payload: {'cate':data.banggood},
      });
    },

    *getBrandList({payload},{ call, put}) {
      const {data,code} = yield call(getBrandList, parse(payload));
      
      let brand = [];
      // 数据格式转换
      for (let i in data) {
        brand.push(data[i]);
      }
      
      yield put({
        type: 'updateState',
        payload: {'brand':brand},
      });
    },

    *getBgProductRunChart ({payload}, { call, put, select }) {
      yield put({type: 'updateState',payload: {'goodsEchartDataLoading':false}});  // 加载状态
      const {data, code} = yield call(getBgProductRunChart, payload); 
      
      let formatData = formatEchartData(data,payload.startTime,payload.endTime);
      yield put({
        type: 'updateState',
        payload: {'goodsEchartData':{...formatData},'goodsEchartDataLoading':true},
      });
    },
  },
})





/*************************** 以下代码为转换数据格式 ****************************/

/**
 * 转换cate数据格式
 */
const cateToMenu = (cate) => {
  var arr = [];

  const mapCateToString = (item) => {
    
    item.map((i, index) => {
      i.value = i.cid;
      i.label = i.cname;

      if (i.children) {
        mapCateToString(i.children);
      }
    });
  };

  for (let i in cate) {
    mapCateToString(cate);

    var obj = {
      value: i,
      label: i,
      children: cate[i]
    };
    if (i !== "") {
      arr.push(obj);
    }
  }

  return arr;
};

/**
 * 转换主趋势图数据格式
 */
const formatEchartData=(echartData,time1,time2) =>{
  if(echartData == null){
    return 
  }

  let data = echartData,               // data
  startTime = time1,    // 开始时间
  endTime = time2,        // 结束时间
  
  legendData = [],                  // 存储echart的结构数据
  seriesData = [],                  // 存储echart的结构数据 
  xAxisData = dataScope(startTime, endTime);     // 存储echart的结构数据

  for (let i in data) {
    let obj = data[i],
        arrItem = {
                name: dataToLabel(i),
                type: 'line',
            },
        arrItemData = [];

    legendData.push(dataToLabel(i));

    for (let k in obj) {
        arrItemData.push((obj[k]));
    }
    arrItem.data = arrItemData;
    seriesData.push(arrItem);
  }

  const goodsEchartData = {
    legendData: legendData,
    seriesData: seriesData,
    xAxisData: xAxisData
  }

  return goodsEchartData;
}

/**
* 计算两个日期时间段内所有日期 
* return 日期数组 
*/
const dataScope = (begin, end) => {
  var ab = begin.split('-');
  var ae = end.split('-');
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  var arr = [];
  for (var k = unixDb; k <= unixDe;) {
      arr.push((new Date(parseInt(k))).format());
      k = k + 24 * 60 * 60 * 1000;
  }
  return arr;
}

Date.prototype.format = function () {
  var s = '';
  var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
  var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
  s += this.getFullYear() + '-'; // 获取年份。  
  s += mouth + '-'; // 获取月份。  
  s += day; // 获取日。  
  return (s); // 返回日期。  
};

/**
* 把数据转为汉字标识
* @param value  原始值 
* return 转换后的数组 
*/
const dataToLabel = (value) => {
  let label = '';
  switch (value) {
      case 'priceSet':
          label = '价格';
          break;
      case 'salesSet':
          label = '销量';
          break;
      case 'scoreSet':
          label = '评分';
          break;
      case 'reviewsSet':
          label = '评论';
          break;
      case 'questionsSet':
          label = '问答';
          break;
      case 'favoritesSet':
          label = '关注';
          break;
  }

  return label;
}
