import React from 'react'
import { connect } from 'dva';
import styles from './index.less';
import { Spin, DatePicker, Button, message } from 'antd'
import Saleroom from './components/saleroom'
import Rank from './components/rank'
import Reference from './components/reference'
import Category from './components/category'

class Home extends React.Component {
  constructor() {
    super();
    
    this.state = {
      time:"2017-09-25",
    }
}
	
	render() {
		return (
      <div className={styles.main}>
          <Saleroom 
            productTotal={this.props.productTotal}
            salesAmount={this.props.salesAmount}
            salesSum={this.props.salesSum}
            changeRate={this.props.changeRate}
            productNew={this.props.productNew}
          /> 
          <Reference
            basket={this.props.basket}
            favorites={this.props.favorites}
            visitor={this.props.visitor}
            pageView={this.props.pageView}
          />
          <Rank myProductRank={this.props.myProductRank} 
          />
          <Category
            loading={this.props.cateLoading}
            cateSet={this.props.cateSet}
            myProductInCate={this.props.myProductInCate}
            productInCate={this.props.productInCate}
            myCateSalesFromPrice={this.props.myCateSalesFromPrice}
            banggoodCate={this.props.banggoodCate}
            getCategoryByCid={cid => this.getCategoryByCid(cid)}
          /> 
      </div>
		)
  }

  /**
	 * 获取类目信息
	 * @param {string} cid 
	 */
	getCategoryByCid(cid) {
		this.props.dispatch({
			type: 'home/queryCate',
			payload: {
				time:this.state.time,
				cid:cid,
			}
		});
	}
}

function mapStateToProps(state) {
  console.log('mapStateToProps',state.home);
	return { ...state.home};
}

export default connect(mapStateToProps)(Home);
