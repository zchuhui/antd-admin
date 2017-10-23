import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Spin, DatePicker, Button, message } from 'antd'
import SearchBar from './components/search-bar'
import List from './components/goods-list'

class Goods extends React.Component {

	
	render() {
		return (
      <div>
          <SearchBar 
            cate={this.props.cate}
            brand={this.props.brand}
            handleSearchArgs={args => this.handleSearchArgs(args)}
          />
          <List 
            list={this.props.list} 
            page={this.props.page} 

            loading={this.props.loading} 
            changePagination={current => this.changePagination(current)} 
            changeTableSort={sort => this.changeTableSort(sort)} 
            
            goodsEchartData={this.props.goodsEchartData} 
            goodsEchartDataLoading={this.props.goodsEchartDataLoading} 
            getGoodsEcharData={args => this.getGoodsEcharData(args)} 

            getBgProductContrast={pid => this.getBgProductContrast(pid)} 
            clearGoodsContrastData={args => this.clearGoodsContrastData(args)}
            goodContrastData={this.props.goodContrastData}
            goodContrastDataLoading={this.props.goodContrastDataLoading} 
          />

      </div>
		)
    }

  /**
   * 搜索
   * @param {object} params 
   */
  handleSearchArgs(params) {
    this.props.dispatch({
        type: 'goods/query',
        payload: {
            ...params
        }
    });
  }

  
    /**
     * 分页
     * @param {int} page   
     */
    changePagination(page) {
      this.props.dispatch({
          type: 'goods/query',
          payload: {
              page: page,
          }
      });
  }

  /**
   * 表格排序
   * @param {string} sort  
   */
  changeTableSort(sort) {
      this.props.dispatch({
          type: 'goods/query',
          payload: {
              sort: sort,
          }
      });
  }

  /**
   * 获取趋势图数据
   * @param {object} params 
   */
  getGoodsEcharData(params){
      this.props.dispatch({
          type:'goods/getBgProductRunChart',
          payload:{
              pid:params.pid,
              startTime:params.startTime,
              endTime:params.endTime,
          },
      })
  }

  /**
   * 根据商品的 pid 获取对比数据
   */
  getBgProductContrast(pid){
      this.props.dispatch({
          type:'goods/getBgProductContrast',
          payload:{
              pid:pid,
          }
      })
  }

  /**
   * 清空对比数据
   * @param {object} args 
   */
  clearGoodsContrastData(args){
      this.props.dispatch({
          type:'RelevanceBGModel/clearGoodContrastData',
          payload:{}
      })
  }


}



function mapStateToProps(state) {
  return {...state.goods}
}

export default connect(mapStateToProps)(Goods);
