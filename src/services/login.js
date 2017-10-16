/* import { request, config } from 'utils'

const { api } = config
const { userLogin } = api

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}
 */

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