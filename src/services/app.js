
import { config } from 'utils'
import request from 'utils/requestbg.js'

const { apibg } = config


export async function login (params) {

  Object.assign(params,{'com':'login','t':'validate'});
  
	return request(apibg, {
		method: 'post',
		data: params,
	});
}

export async function logout (params) {

    Object.assign(params,{'com':'login','t':'logout'});
    
    return request(apibg, {
      method: 'get',
      data: params,
    });
}