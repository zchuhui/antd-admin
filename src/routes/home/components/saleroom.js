/**
 * 销售秘书-销售额模块
 * Date: 2017-07-10
 * Autor:zhuangchuhui
 */

import React from 'react';
import styles from './sale-secy.less';
import { DatePicker, Icon, Button, Spin} from 'antd';
import moment from 'moment';
import echarts from 'echarts';

class Saleroom extends React.Component {

	constructor() {
		super();

		this.state = {
			runChart:null,   // 图表数据

			item1:1,         // 模块1
			item2:0,         // 模块2
			item3:0,         // 模块3
			item4:0,		 // 模块4
			itemName:'销售额'
		}

	}

	render() {
		return (
			<div className={styles.panel} ref='saleroomId'>
				{
					this.props.salesAmount ?
					<div className={styles.saleroomWrap}> 
						<div className={styles.head}>
							<span>当前BG拥有 
								<b>{this.props.productTotal ? this.props.productTotal.productTotal : 0}</b> 件在售商品 &nbsp; &nbsp; &nbsp; &nbsp;
							</span>
							<span>环比增长 
								<span className={styles.exponentTop}>
									<Icon type="arrow-up" />
									{this.props.productTotal ? this.props.productTotal.yesRadio : 0}
								</span>
							</span>
						</div>
						<div className={styles.clear}>
							<div className={styles.saleroomContent}>
								<ul className={styles.clear}>
									<li className={this.state.item1?styles.borderBottomNone:null} 
										onClick={this.onSaleroomItem.bind(this,this.props.salesAmount.runChart,1)}>
										<h3>销售额</h3>
										<div>
											<label>当天</label>
											<b>{this.props.salesAmount.salesAmount ? this.props.salesAmount.salesAmount : 0} 美元</b>
										</div>
										<div>
											<label>前天环比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.salesAmount.yesRadio)}
											</span>
										</div>
										<div>
											<label>上周同比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.salesAmount.weekRadio)}
											</span>
										</div>
									</li>
									<li className={this.state.item2?styles.borderBottomNone:null}
										onClick={this.onSaleroomItem.bind(this,this.props.salesSum.runChart,2)}>
										<h3>销量</h3>
										<div><label>当天</label><b>{this.props.salesSum.salesSum ? this.props.salesSum.salesSum : 0} 件</b></div>
										<div><label>前天环比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.salesSum.yesRadio)}
											</span>
										</div>
										<div><label>上周同比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.salesSum.weekRadio)}
											</span>
										</div>
									</li>
									<li className={this.state.item3?styles.borderBottomNone:null}
										onClick={this.onSaleroomItem.bind(this,this.props.changeRate.runChart,3)}>
										<h3>转化率</h3>
										<div><label>当天</label><b>{this.props.changeRate.changeRate ? parseFloat(this.props.changeRate.changeRate).toFixed(2) : 0} %</b></div>
										<div><label>前天环比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.changeRate.yesRadio)}
											</span>
										</div>
										<div><label>上周同比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.changeRate.weekRadio)}
											</span>
										</div>
									</li>
									<li className={this.state.item4?styles.borderBottomNone:null}
										onClick={this.onSaleroomItem.bind(this,this.props.productNew.runChart,4)}>
										<h3>新品上架数</h3>
										<div><label>当天</label><b>{this.props.productNew.productNew ? this.props.productNew.productNew : 0} 件</b></div>
										<div><label>前天环比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.productNew.yesRadio)}
											</span>
										</div>
										<div><label>上周同比</label>
											<span className={styles.exponentTop}>
												{this.formatTrendPercentage(this.props.productNew.weekRadio)}
											</span>
										</div>
									</li>
								</ul>
								<div>
									<div ref='saleroomChart' style={{ width: '100%', height: 300 }}></div>
								</div>
							</div>
						</div>
					</div>
					:
					<div className={styles.dataNullWrap}><Spin /></div>
				}
			</div>
		)
	}


	componentDidMount() { }

	componentDidUpdate() { 
		// 首次加载
		if(this.state.runChart == null){
			this.state.runChart = this.props.salesAmount?this.props.salesAmount.runChart:null
		}

		// 更新Echart图表数据
		this.loadChart(this.getEchartData(this.state.runChart))
	}


	
	/**
	 * 异步定时器
	 * @param {number} ms 
	 */
    timeout(ms){
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    }

	/**
	 * 载入echart图表
	 * @param {array} data 
	 */
	loadChart(data) {

		let itemName = this.state.itemName;  // 获取显示名称

		if (this.refs.saleroomChart) {
			// 初始化Echart
			let myChart = echarts.init(this.refs.saleroomChart);

			// 绘制图表
			myChart.setOption({
				title: {
				},
				tooltip: {
					trigger: 'axis',
					/* axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}, */
					formatter: function (params,ticket,callback) { 
						if(itemName == "转化率"){
							return '<div><p>'+params[0].name+'</p><p>'+itemName+": "+(parseFloat(params[0].value)).toFixed(2)+'%</p></div>'
						}else if(itemName == "销售额"){
							return '<div><p>'+params[0].name+'</p><p>'+itemName+": "+parseFloat(params[0].value).toFixed(2)+'</p></div>'
						}
						else{
							return '<div><p>'+params[0].name+'</p><p>'+itemName+": "+parseFloat(params[0].value).toFixed(0)+'</p></div>'
						}
					}
				},
				legend: {
				},
				toolbox: {
					feature: {
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: data.dateArray,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666'   // x轴字体颜色
							}
						},
						axisLine: {
							lineStyle: {
								color: '#acdaff'    // x轴颜色
							}
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						splitNumber: 2,
						scale: true,
						show: true,
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666'   // y轴字体颜色
							}
						},
						axisLine: {
							lineStyle: {
								color: '#acdaff'    // y轴颜色
							}
						}
					}
				],
				series: [
					{
						name: '',
						type: 'line',
						stack: '',
						itemStyle: {
							normal: {
								color: '#acdaff',
								show: true,
							},
						},
						/* label: {
							normal: {
								show: true,
								position: 'top'
							}
						}, */
						areaStyle: { normal: {} },
						data: data.valueArray
					}
				]
			});
		}

	}

	/**
	 * 把数据转成EChart数据
	 * @param {*} runChart 
	 */
	getEchartData(runChart) {

		let obj = {
			dateArray:[],
			valueArray:[]
		}

		if(runChart){
			let arr1 = [];
			let arr2 = [];
			for(let i in runChart){
				if(i !== 'dateArray' && i !== 'valueArray'){
					let dateLabel = `${i.split('.')[0]}月${i.split('.')[1]}日`;
					arr1.push(dateLabel);
					arr2.push(runChart[i]);
				}
			}

			obj.dateArray = arr1;
			obj.valueArray = arr2;
		}
		return obj;
	}

	/**
	 * 点击切换模块：包括下边框、Echart数据
	 * @param {object} runChart 
	 * @param {number} index 
	 */
	onSaleroomItem(runChart,index){
		switch(index){
			case 1:
				this.setState({
					item1:1,
					item2:0,
					item3:0,
					item4:0,
					runChart:runChart,
					itemName:'销售额',
				});
				break;
			case 2:
				this.setState({
					item1:0,
					item2:1,
					item3:0,
					item4:0,
					runChart:runChart,
					itemName:'销量',
				});
				break;
			case 3:
				this.setState({
					item1:0,
					item2:0,
					item3:1,
					item4:0,
					runChart:runChart,
					itemName:'转化率',
				});
				break;
			case 4:
				this.setState({
					item1:0,
					item2:0,
					item3:0,
					item4:1,
					runChart:runChart,
					itemName:'上架数',
				});
				break;
		}
	}
	
	/**
	 * 格式化热度的显示格式
	 * @param {string} no 
	 */
	formatTrendPercentage(no) {
		if (no) {
			no = no.split('%')[0];
			if (no > 0) {
				return (<span className={styles.exponentTop}><Icon type="arrow-up" /> {no}%</span>)
			}
			else if (no < 0) {
				return (<span className={styles.exponentDown}><Icon type="arrow-down" /> {no}%</span>)
			}
			else if (no == 0) {
				return (<span className={styles.exponentZero}> {no}%</span>)
			}
		}
	}

}


export default Saleroom;