
import { config } from 'utils'
import request from 'utils/requestbg.js'

const { apibg } = config


/**
 * 获取表格数据
 */
export async function query (params) {

  Object.assign(params,{'com':'ajax','t':'getBgProductList'})
  
	return request(apibg, {
		method: 'get',
		data: params,
	});
}

/**
 * 获取分类
 */
export async function getCateList () {
	const params = {'com':'ajax','t':'getCateList','site':'banggood'}
	return request(apibg, {
		method: 'get',
		data: params,
	})
}

/**
 * 获取品牌
 */
export async function getBrandList () {
	const params = {'com':'ajax','t':'getBrandList','site':'banggood'}
	return request(apibg, {
		method: 'get',
		data: params,
	})
}

/**
 * 获取主趋势图
 */
export async function getBgProductRunChart (params) {
	Object.assign(params, {'com':'ajax','t':'getBgProductRunChart'});
	return request(apibg, {
		method: 'get',
		data: params,
	})
}


/**
 * 获取对比商品数据
 */
export async function getBgProductContrast(pid) {
    const params = {'com':'ajax','t':'getBgRelateProductComtrastInfo','pid':pid};
    return request(apibg, {
      method: 'get',
      data: params,
    });
}




/******************* 关联模块 ********************/

/**
 * 获取单个商品信息
 * @param  {[type]} params [site,sku]
 * @return {[type]}      [data]
 */
export async function getProductInfo(params) {
    Object.assign(params,{'com':'ajax','t':'productInfo'})

    return request(apibg, {
        method: 'get',
        data: params,
    });
}


/**
 * 获取相似商品列表
 * @param  {[type]} params [site,sku]
 * @return {[type]}      [data]
 */
export async function getLikeProduct(params) {
    Object.assign(params,{'com':'ajax','t':'getLikeProduct'})
    return request(apibg, {
        method: 'get',
        data: params,
    });
  }

  /**
 * 获取该商品已关联的竞品表
 * @param  {[type]} params [site,sku]
 * @return {[type]}      [data]
 */
export async function fetchRevanceBySku(params) {
    Object.assign(params,{'com':'ajax','t':'getBgToOtherRelationInfo'})
    return request(apibg, {
        method: 'get',
        data: params,
    });
}

/**
 * 设置关联的商品
 * @param  {[type]} params [sku,list]
 * @return {[type]}      [data]
 */
export async function setRelevanceGoods(params) {
    Object.assign(params,{'com':'ajax','t':'setBgToOtherRelation','sku':params.sku,'content':JSON.stringify(params.relevanceGoodsList)})
    return request(apibg, {
        method: 'get',
        data: params,
    }); 
}
  
/**
 * 清除已关联的商品
 * @param  {object} args [sku,list]
 * @return {object}      [data]
 */
export async function clearRelevanceGoods(params) {
  Object.assign(params,{'com':'ajax','t':'delBgToOtherRelation','sku':params.sku})
  return request(apibg, {
      method: 'get',
      data: params,
  }); 
}



/******************* 详情模块 ********************/

/**
 * 根据SKU获取商品
 * @param {string} sku 
 */
export async function getGoodsBySku(sku) {
    const params = {'com':'products','sku':sku};
    return request(apibg, {
          method: 'get',
          data: params,
    });
}


/**
 * 根据SKU获取商品价格汇总信息
 * @param {string} sku 
 */
export async function getPriceListBySku(sku) {
    const params = {'com':'products','t':'priceSet','sku':sku};
    return request(apibg, {
          method: 'get',
          data: params,
    });
}


/**
 * 获取单个商品某段时间内价格趋势图和对比关系
 * @param {object} params 
 */
export async function getGoodsByParams(params) {
    Object.assign(params,{'com':'products','t':'productOtherRunChart'})
    return request(apibg, {
          method: 'get',
          data: params,
    });
}

