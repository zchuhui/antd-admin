import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import Storage from 'utils/storage'
import {storageSaveTime} from 'utils/config'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const {code,data} = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      
      if (code == 200) {
        const { from } = locationQuery

        // 存储用户名、token
        Storage.set('username', data.userInfo.admin_name, storageSaveTime);
        Storage.set('token', data.token, storageSaveTime);
        
        //yield put({ type: 'app/query' })
        
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))             //跳转到指定地址
        } else {
          yield put(routerRedux.push('/home'))     //跳转到首页
        }  
      } else {
        throw data
      }
    },
  },

}
