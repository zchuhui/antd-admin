import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import { getMenuCate, getHotProductsRateInCate, getCateChartInHotProducts} from 'services/rival'
import { message } from 'antd'
import { CODE200 } from 'utils/config'
import DateTime from 'utils/time';


export default modelExtend(model, {
    namespace: 'sort',

    state: {
        loading: true,
    },
    
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type:'getCateList'});
        }
    },

    effects: {
        *getHotProductsRateInCate({ payload }, { call, put, dispatch}) {
            yield put({
                type: 'updateState',
                payload: { 'loading': true }
            });

            const { data, code, msg } = yield call(getHotProductsRateInCate, payload);
            if (code == CODE200){
                let label = [],value = [],num = [];
                data.child.map((item,index)=>{
                    label.push(item.cname);
                    value.push(item.rate.split('%')[0]);
                    num.push(item.num);
                });

                data.labels = label;
                data.values = value;
                data.nums = num;

                yield put({
                    type: 'updateState',
                    payload: { 'data': data }
                });
            }else{
                yield put({
                    type: 'updateState',
                    payload: { 'data': null }
                });
            }
            

            yield put({
                type: 'updateState',
                payload: { 'loading': false }
            });

        },

        *getCateChartInHotProducts({ payload }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { 'cateLoading': true }
            });

            const { data, code, msg } = yield call(getCateChartInHotProducts, payload);

            if (code == CODE200) {
                data.labels = data.dateSet;
                data.values = data.sumSet;

                yield put({
                    type: 'updateState',
                    payload: { 'cateData': data }
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { 'cateData': null }
                });
            }

            yield put({
                type: 'updateState',
                payload: { 'cateLoading': false }
            });
        },

        *getCateList({ payload }, { call, put }) {
            const { data, code } = yield call(getMenuCate, payload);
            //格式化
            const cate = cateToMenu(data);
            yield put({
                type: 'updateState',
                payload: { 'cate': cate },
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