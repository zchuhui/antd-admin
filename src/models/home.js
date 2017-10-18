import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query, queryCate } from 'services/home'
import { model } from 'models/common'

export default modelExtend(model, {
  namespace: 'home',
  state: {
    
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/home' || pathname === '/') {
          dispatch({ type: 'query',payload:{time:'2017-09-25'} })
          dispatch({ type: 'queryCate',payload:{time:'2017-09-25'} })
        }
      })
    },
  },
  effects: {
    * query ({
      payload,
    }, { call, put }) {
      const {data,code} = yield call(query, parse(payload));

      yield put({
        type: 'updateState',
        payload: data,
      });

      
    },
    * queryCate ({
      payload,
    }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {cateLoading:true},
      })

      const {data,code} = yield call(queryCate, parse(payload));
      
      yield put({
        type: 'updateState',
        payload: data,
      });

      yield put({
        type: 'updateState',
        payload: {cateLoading:false},
      })
    }
  },
})
