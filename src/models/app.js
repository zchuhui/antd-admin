/* global window */
/* global document */
/* global location */
import { routerRedux } from "dva/router";
import { parse } from "qs";
import config from "config";
import { EnumRoleType } from "enums";
import { query, login, logout } from "services/app";
import * as menusService from "services/menus";
import queryString from "query-string";
import Storage from 'utils/storage'

const { prefix } = config;

export default {
  namespace: "app",
  state: {
    user: {},
    permissions: {
      visit: []
    },
    menu: [
      {
        id: 1001,
        icon: "laptop",
        name: "首页",
        router: "/home"
      }
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === "true",
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === "true",
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys:
      JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: "",
    locationQuery: {}
  },
  subscriptions: {
    /* setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search)
          }
        });
      });
    }, */

    setup({ dispatch }) {
      dispatch({ type: "query" });
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: "changeNavbar" });
        }, 300);
      };
    }
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      
      const { locationPathname } = yield select(_ => _.app);
      const username = Storage.get('username');
      console.log(username);
      //const { success, user } = yield call(query, payload);
      
      if(username){
        const menu  = yield call(menusService.menuData);    // 获取菜单
        const user = {'username': username}                 // 获取用户信息

        yield put({
          type: "updateState",
          payload: {
            user,
            // permissions,
            menu
          }
        });
        if (location.pathname === "/login") {
          yield put(
            routerRedux.push({
              pathname: "/home"
            })
          );
        }
      } 
      /* else if (
        config.openPages &&
        config.openPages.indexOf(locationPathname) < 0
      )  */
      else{
        yield put(
          routerRedux.push({
            pathname: "/login",
            search: queryString.stringify({
              from: locationPathname
            })
          })
        );
        
      }

      /* if (success && user) {
        const { list } = yield call(menusService.query);    // 获取菜单
        const { permissions } = user;                       // 获取用户权限
        let menu = list;

        // 判断用户信息、权限、菜单
        if (
          permissions.role === EnumRoleType.ADMIN ||
          permissions.role === EnumRoleType.DEVELOPER
        ) {
          permissions.visit = list.map(item => item.id);
        } else {
          menu = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === "-1"
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true
            ];
            return cases.every(_ => _);
          });
        }
        yield put({
          type: "updateState",
          payload: {
            user,
            permissions,
            menu
          }
        });
        if (location.pathname === "/login") {
          yield put(
            routerRedux.push({
              pathname: "/dashboard"
            })
          );
        }
      } else if (
        config.openPages &&
        config.openPages.indexOf(locationPathname) < 0
      ) {
        yield put(
          routerRedux.push({
            pathname: "/login",
            search: queryString.stringify({
              from: locationPathname
            })
          })
        );
      } */
    },

    *logout({ payload }, { call, put }) {
      const {data, code, msg } = yield call(logout, parse(payload));
      if (code == 200) {
        Storage.remove('username');
        Storage.remove('token');
        yield put({ type: "query" });
      } else {
        throw data;
      }
    },

    *changeNavbar(action, { put, select }) {
      const { app } = yield select(_ => _);
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({ type: "handleNavbar", payload: isNavbar });
      }
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold
      };
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible
      };
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload
      };
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys
      };
    }
  }
};
