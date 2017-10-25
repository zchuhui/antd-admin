import React from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import Detail from './detail';

let SKU;

class Index extends React.Component {

    render(){
        return (
            <Detail 
                sku={SKU} 
                goodsLoading={this.props.goodsLoading}
                chartLoading={this.props.chartLoading}
                priceLoading={this.props.priceLoading}
                goods={this.props.goods} 
                priceList={this.props.priceList} 
                compareInfoList={this.props.compareInfoList}
                relateInfo={this.props.relateInfo}
                runChart={this.props.runChart}
                attrInfo={this.props.attrInfo}
                relateInfoNewChart={this.props.relateInfoNewChart}
                onGoodsOtherRunChart={params => this.onGoodsOtherRunChart(params)}
            />
        )
    }


    onGoodsOtherRunChart(argus){
        this.props.dispatch({
            type: 'detail/getGoodsByParams',
            payload: argus
        })
    }
    

    componentDidMount(){
        
        const match = pathToRegexp("/goods/detail/:sku").exec(window.location.pathname);
        if (match) {
          SKU = match[1];
        } else {
          SKU = null;
        }
        
        // 根据sku请求数据
        if(SKU){
            this.props.dispatch({
                type: 'detail/getGoodsBySku',
                payload: {
                    sku: SKU
                }
            })
        }

    }


}

function mapStateToProps(state){
    console.log(state.detail);
    return {...state.detail};
}

export default connect(mapStateToProps)(Index)