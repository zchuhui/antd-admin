import modelExtend  from 'dva-model-extend'
import { model } from 'models/common'
import { 
    getRivalDataByDate, 
    getRivalDataByParams, 
    setRelatedBgBySku, 
    addPurchaseProducts,
    getMenuCate,
    getMenuBrand } from 'services/rival'

import { message } from 'antd'

const CODE200 = 200;

export default modelExtend(model, {
    namespace:'rival',

    state:{
        loading:true,
        rivalData:null,

        rivalViewLoading:true,
        rivalViewList:null,

        relatedLoading:false,     // 关联加载
        relatedStatus:0,          // 关联状态

        stockLoading:false,      // 采购加载
        stockStatus:false,       // 采购状态
    },

    reducers:{
        // 更新初始加载状态
		updateLoading(state,{ payload }){
			return {...state, loading: payload.loading}
        },
        // 更新初始加载状态
		updateRivalViewLoading(state,{ payload }){
			return {...state, rivalViewLoading: payload.loading}
        },

        // 存储图表数据
        saveRivalData(state,{ payload }){
            return {...state, rivalData:payload};
        },
        // 存储列表数据
        saveRivalViewList(state,{ payload }){
            return {...state, rivalViewList:payload};
        },

        // 更新关联的加载状态
        updateRelatedLoading(state,{payload}){
            return {...state,relatedLoading:payload}
        },

        // 更新关联状态
        updateRelatedStatus(state,{payload}){
            return {...state,relatedStatus:payload}
        },

        // 更新采购加载状态
        updateStockLoading(state,{payload}){
            return {...state, stockLoading:payload}
        },

        // 更新采购状态
        updateStockStatus(state,{payload}){
            return {...state, stockStatus:payload}
        },

    },

    effects: {
        // 获取竞品图表数据
		* getRivalDataByDate({payload},{select,call,put}){
            // 清空数据
            yield put({ type:'saveRivalData', payload:{data:null}});

            yield put({type:'updateLoading', payload:{loading:true}})
            
            // 请求获取数据
            const { data } = yield call(getRivalDataByDate,payload);
            
            if(data){
                yield put({ type:'saveRivalData', payload:data});
            }
            
            yield put({type:'updateLoading', payload:{loading:false}})
        },
    
        // 获取竞品列表数据
		* getRivalDataByParams({payload},{select,call,put}){
            // 清除关联、采购状态
            yield put({ type:'updateRelatedStatus', payload:0});
            yield put({ type:'updateStockStatus', payload:false});

            //try{
                // 先清空数据
                yield put({ type:'saveRivalViewList', payload:{data:null}});
                
                yield put({type:'updateRivalViewLoading', payload:{loading:true}})
                
                const { data } = yield call(getRivalDataByParams,payload);
                
                if(data){
                    yield put({ type:'saveRivalViewList', payload:data});
                }
                yield put({type:'updateRivalViewLoading', payload:{loading:false}})
            
            /* }catch(e){
                yield put({type:'updateRivalViewLoading', payload:{loading:false}})

                message.destroy();
                message.warning(ERRORMESSAGE);
            } */
        },

        // 关联商品
		* setRelatedBgBySku({payload},{select,call,put}){

            yield put({ type:'updateRelatedLoading', payload:true});

            const {data, code, msg} = yield call(setRelatedBgBySku,payload);
            
            if(code == CODE200){
                message.success(msg)
                yield put({ type:'updateRelatedStatus', payload:1});
            }else{
                yield put({ type:'updateRelatedStatus', payload:2});
            }
            yield put({ type:'updateRelatedLoading', payload:false});
        },

        // 商品采购
		* setStock({payload},{select,call,put}){
            
            yield put({ type:'updateStockLoading', payload:true});

            const {data, code, msg} = yield call(addPurchaseProducts,payload);

            if(code == CODE200){
                message.success(msg)
                yield put({ type:'updateStockStatus', payload:true});
            }else{
                yield put({ type:'updateStockStatus', payload:false});
            }
            
            yield put({ type:'updateStockLoading', payload:false});
        },

        // 获取分类
        *getCateList({payload},{ call, put}) {
            const {data,code} = yield call(getMenuCate, payload);
            //格式化
            const cate = cateToMenu(data);
            yield put({
              type: 'updateState',
              payload: {'cate':cate},
            });
        },

        // 获取品牌
        *getBrandList({payload},{ call, put}) {
            const {data,code} = yield call(getMenuBrand, payload);
            
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
    }
});





/*************************** 以下代码为转换数据格式 ****************************/

/**
 * 转换cate数据格式
 */
const cateToMenu = cate => {
    var arr = [];
  
    const mapCateToString = item => {
      item.map((i, index) => {
        i.value = i.cid;
        i.label = i.cname;
  
        if (i.children) {
          mapCateToString(i.children);
        }
      });
    };
    
    for (let i in cate) {
      mapCateToString(cate[i]);
  
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