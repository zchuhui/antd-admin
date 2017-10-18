/**
 * BG 创建关联 Model
 * Date: 2017-8-17
 * Author: zhuangchuhui
 */

//import * as BgService from '../../../services/service-bg-goods';

import { getProductInfo, getLikeProduct, fetchGoodsDetailBySku, fetchRevanceBySku, setRelevanceGoods, clearRelevanceGoods } from 'services/goods'
import { message } from 'antd';

const CODE200 = 200

export default {
	namespace: "relevance",
	state: {
		// 创建关联模块的加载状态
		createRelevanceLoading: false,

		// 步骤一单个商品
		goods: {},
		sku:null,

		// 步骤二单个商品
		goodsBySite: {},

		// 相似的商品表
		similarGoodsList: [],

		// 选中的关联商品
		relevanceGoodsList: [],

		// 设置状态是否成功
		setRevanceStatus: false
	}, 

	reducers: {

		/**
		 * 存储相似的商品表
		 * @param {*} state 
		 * @param {*} param1 
		 */
		saveSimilarGoodsList(state, { payload: { data } }) {

			// 处理数据
			let array = [];
			let index = 0;
			for (let label in data) {
				let obj = {};
				obj.tname = label;
				obj.tkey = index;
				obj.children = data[label];

				array.push(obj);
				index++;
			}

			return { ...state, similarGoodsList: array };
		},
		
		/**
		 * 存储获取的单个商品(步骤一)
		 * @param {*} state 
		 * @param {*} param1 
		 */
		saveRelevanceGoods(state, { payload }) {
			return { ...state, goods: {data:payload}, sku:payload.sku };
		},
		
		/**
		 * 保存获取的单个商品（步骤二）
		 * @param {*} state 
		 * @param {*} param1 
		 */
		saveRelevanceGoodsBySite(state, { payload }) {
			return { ...state, goodsBySite: payload };
		},
		
		/**
		 * 存储已关联的商品（步骤二）
		 * @param {*} state 
		 * @param {*} param1 
		 */
		saveRelevanceGoodsList(state, { payload }) {

			// 数据格式转换
			let originData = payload;
			let formatData = [];

			if (originData) {

				let index;
				let obj;
				
				for (let item in originData) {
					switch (item) {
						case 'gearbest':
							index = 0;
							obj = originData[item];
							break;
						case 'lightinthebox':
							index = 1;
							obj = originData[item];
							break;
						case 'dx':
							index = 2;
							obj = originData[item];
							break;
						case 'tomtop':
							index = 3;
							obj = originData[item];
							break;
					}
	
					formatData[index] = obj;
				}
			}

			return { ...state, relevanceGoodsList: formatData };
		},
		
		/**
		 * 切换创建关联模块的 loading 状态
		 */
		toggleCreateRelevanceLoading(state, { payload }) {
			return { ...state, createRelevanceLoading: payload.loading };
		},
		
		/**
		 * 切换设置关联状态，成功与否
		 * @param {*} state 
		 * @param {*} param1 
		 */
		toggleSetRevanceStatus(state, { payload }) {
			return { ...state, setRevanceStatus: payload.status };
		}
		
	},

	effects: {

		/**
		 * 根据 sku 搜索单个商品(步骤一)
		 * @param {*} param0
		 * @param {*} param1
		 */
		*getProductInfo({ payload }, { select, call, put }) {
			// 显示加载状态
			yield put({type: "toggleCreateRelevanceLoading",payload: { loading: true }});

			// 请求获取商品信息
			const { data, code } = yield call(getProductInfo, payload);
			
			if (code == CODE200) {
				// 存储商品信息
				yield put({ type: "saveRelevanceGoods", payload: data });
				
				// 请求获取已关联的商品
				yield put({ type: "featchRevanceGoods", payload });

				// 请求获取相似商品
				yield put({type: "getLikeProduct", payload: { title: data.pname }});
			}

			// 隐藏加载状态
			yield put({ type: "toggleCreateRelevanceLoading", payload: { loading: false }});
		},

		/**
		 * 手动搜索单个相似商品（步骤二）
		 * @param {*} param0 
		 * @param {*} param1 
		 */
		*fetchGoodsBySkuAndSite({ payload }, { select, call, put }) {
			// 显示加载状态
			yield put({type: "toggleCreateRelevanceLoading",payload: { loading: true } });

			// 请求获取数据
			const { data, code } = yield call(fetchGoodsDetailBySku, payload);
			if(code == CODE200){
				// 存储数据
				yield put({ type: "saveRelevanceGoodsBySite", payload: data });

				message.destroy();
				message.success("获取成功!");
			}else{
				message.destroy();
				message.error("获取失败!");
			}
			

			// 隐藏加载状态
			yield put({type: "toggleCreateRelevanceLoading",payload: { loading: false }});
		}, 

		/**
		 * 获取相似商品列表（步骤二）
		 * @param {*} param0
		 * @param {*} param1
		 */
		*getLikeProduct({ payload }, { select, call, put }) {
			const { data } = yield call(getLikeProduct, payload);
			yield put({ type: "saveSimilarGoodsList", payload: { data: data } });
		},

		/**
		 * 获取已关联的商品 (步骤二)
		 * @param {*} param0 
		 * @param {*} param1 
		 */
		*featchRevanceGoods({ payload }, { select, call, put }) {
			const { data } = yield call(fetchRevanceBySku, payload);
			yield put({ type: "saveRelevanceGoodsList", payload: data });
		}, 

		/**
		 * 设置关联相似商品(步骤二)
		 * @param {*} param0 
		 * @param {*} param1 
		 */
		*setRelevanceGoods({ payload }, { call, put }) {

			try {
				// 显示加载状态
				yield put({type: "toggleCreateRelevanceLoading",payload: { loading: true }});

				// 请求设置
				const { data, code} = yield call(setRelevanceGoods, payload);

				if(code == CODE200){
					yield put({ type: "toggleSetRevanceStatus",payload: { status: true }});
					
					// 隐藏加载状态
					yield put({type: "toggleCreateRelevanceLoading",payload: { loading: false }});
				}
				
			} catch (e) {
				// 存储关联失败信息
				yield put({type: "toggleSetRevanceStatus",payload: { status: false }});
				// 隐藏加载状态
				yield put({type: "toggleCreateRelevanceLoading",payload: { loading: false }});

				message.destroy();
				message.warning('关联失败');
			}
		}, 

		/**
		 * 清除已关联商品 (步骤二)
		 * @param {*} param0 
		 * @param {*} param1 
		 */
		*clearRelevanceGoods({ payload }, { call, put }) {

			try {
				// 显示加载状态
				yield put({type: "toggleCreateRelevanceLoading",payload: { loading: true }});

				// 请求设置
				const { data } = yield call(clearRelevanceGoods, payload);
				// 存储设置信息
				yield put({ type: "toggleSetRevanceStatus",payload: { status: true }});

				// 隐藏加载状态
				yield put({type: "toggleCreateRelevanceLoading",payload: { loading: false }});
				
			} catch (e) {
				// 存储关联失败信息
				yield put({type: "toggleSetRevanceStatus",payload: { status: false }});
				// 隐藏加载状态
				yield put({type: "toggleCreateRelevanceLoading",payload: { loading: false }});

				message.destroy();
				message.warning('关联失败');
			}
		}, 
		
	},

	subscriptions: {
		setup({ dispatch, history }) {
		/* return history.listen(({ pathname, query }) => {
		}); */
		}
	}
};
