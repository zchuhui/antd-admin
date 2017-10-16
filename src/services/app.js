
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





/* import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}
 */