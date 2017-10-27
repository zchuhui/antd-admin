import { config } from 'utils'
import request from 'utils/requestbg.js'
const { apibg } = config



/**
 * 根据时间获取竞品图表数据
 * @param {object} params 
 */
export async function getRivalDataByDate(params) {
    Object.assign(params,{'com':'products','t':'productNewCountList'})
    return request(apibg, {
          method: 'get',
          data: params,
    });
}
 

/**
 * 搜索竞品数据
 * @param {object} params 
 */
export async function getRivalDataByParams(params) {
    Object.assign(params,{'com':'products','t':'getProductsNewList'})
    return request(apibg, {
          method: 'get',
          data: params,
    });
}

/**
 * 竞品关联BG商品
 * @param {object} params 
 */
export async function setRelatedBgBySku(params) {
    Object.assign(params,{'com':'products','t':'relateBgProduct'})
    return request(apibg, {
          method: 'post',
          data: params,
    });
}

/**
 * 采购
 * @param {object} params 
 */
export async function addPurchaseProducts(params) {
    Object.assign(params,{'com':'purchase','t':'addPurchaseProducts'});
    return request(apibg, {
          method: 'post',
          data: params,
    });
}



/**
 * 获取竞品分类菜单
 */
export function getMenuCate() { 
	const params = {'com':'ajax','t':'getCateList'};
    return request(apibg, {
          method: 'get',
          data: params,
    });
}

/**
 * 获取竞品品牌菜单
 */
export function getMenuBrand() { 
	const params = {'com':'ajax','t':'getBrandList'};
    return request(apibg, {
          method: 'get',
          data: params,
	});
}


