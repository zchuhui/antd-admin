import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import { getMenuCate, getHotProductSequence} from 'services/rival'
import { message } from 'antd'
import { CODE200 } from 'utils/config'
import DateTime from 'utils/time';


export default modelExtend(model, {
    namespace: 'rank',

    state: {
        loading:false, 
    },

    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'getCateList', payload: { level: 2 }});
        }
    },

    effects: {
        *getCateList({ payload }, { call, put }) {
            const { data, code } = yield call(getMenuCate, payload);
            const cate = cateToMenu(data);
            yield put({
                type: 'updateState',
                payload: { 'cate': cate },
            });
        },

        *getHotProductSequence({payload},{call, put}){
            yield put({
                type: 'updateState',
                payload: { 'loading': true }
            });

            const { data, code } = yield call(getHotProductSequence, payload);
            
            if (code == CODE200) {
                yield put({
                    type: 'updateState',
                    payload: { 'data': data }
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { 'data': null }
                });
            }

            yield put({
                type: 'updateState',
                payload: { 'loading': false }
            });
        }
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

