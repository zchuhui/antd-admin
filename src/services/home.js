
import { config } from 'utils'
import request from 'utils/requestbg.js'

const { apibg } = config


export async function query (params) {

  Object.assign(params,{'com':'ajax','t':'getSalesSecretaryInfo'});
  
	return request(apibg, {
		method: 'get',
		data: params,
	});
}

export async function queryCate (params) {
	
		Object.assign(params,{'com':'ajax','t':'getSalesSecretaryCateInfo'});
		
		return request(apibg, {
			method: 'get',
			data: params,
		});
	}