/**
 * 销售秘书-参考指标模块
 * Date: 2017-07-10
 * Autor:zhuangchuhui
 */

import React from 'react';
import styles from './sale-secy.less';
import { Icon, Spin } from 'antd';
import echarts from 'echarts';

class Reference extends React.Component {

    render() {

        return (
			<div className={styles.panel}>
				<div className={styles.panelTitle}>
					参考指标
				</div>
				{
					this.props.basket?
					<div className={styles.referenceIndexWrap}>
						<ul className={styles.clear}>
							<li>
								<h3>加购量</h3>
								<div><label>当天</label><b>{this.props.basket.basket ? this.props.basket.basket : 0} 件</b></div>
								<div><label>前天环比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.basket.yesRadio)}
									</span>
								</div>
								<div><label>上周同比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.basket.weekRadio)}
									</span>
								</div>
								<div className={styles.chartWrap}>
									<div ref="refChart1" style={{ width: '100%', height: 110 }}></div>
								</div>
							</li>
							<li>
								<h3>收藏量</h3>
								<div><label>当天</label><b>{this.props.favorites.favorites?this.props.favorites.favorites:0} 件</b></div>
								<div><label>前天环比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.favorites.yesRadio)}
									</span>
								</div>
								<div><label>上周同比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.favorites.weekRadio)}
									</span>
								</div>
								<div className={styles.chartWrap}>
									<div ref="refChart2" style={{ width: '100%', height: 110 }}></div>
								</div>
							</li>
							<li>
								<h3>访客量</h3>
								<div><label>当天</label><b>{this.props.visitor.visitor?this.props.visitor.visitor:0} 位</b></div>
								<div><label>前天环比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.visitor.yesRadio)}
									</span>
								</div>
								<div><label>上周同比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.visitor.weekRadio)}
									</span>
								</div>
								<div className={styles.chartWrap}>
									<div ref="refChart3" style={{width:'100%',height:110}}></div>
								</div>
							</li>
							<li>
								<h3>浏览量</h3>
								<div><label>当天</label><b>{this.props.pageView.pageView?this.props.pageView.pageView:0} 次</b></div>
								<div><label>前天环比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.pageView.yesRadio)}
									</span>
								</div>
								<div><label>上周同比</label>
									<span className={styles.exponentTop}>
										{this.formatTrendPercentage(this.props.pageView.weekRadio)}
									</span>
								</div>
								<div className={styles.chartWrap}>
									<div ref="refChart4" style={{width:'100%',height:110}}></div>
								</div>
							</li>
						</ul>
					</div>
					:
					<div className={styles.dataNullWrap}><Spin /></div>
				}
				
			</div>
        )
    }

    componentDidMount(){
		

    }

	componentDidUpdate(){
		
		if(this.props.basket ){
			this.loadChart(this.refs.refChart1,this.props.basket.runChart,'加购量');
			this.loadChart(this.refs.refChart2,this.props.favorites.runChart,'收藏量');
			this.loadChart(this.refs.refChart3,this.props.visitor.runChart,'访客量');
			this.loadChart(this.refs.refChart4,this.props.pageView.runChart,'浏览量');
		}
		
	}

	// 载入echart图表
	loadChart(chartId,data,itemName){

		data = this.formatDataToEchartData(data);
		
		if(chartId){

			// 初始化Echart
			let myChart = echarts.init(chartId);  

			// 绘制图表
			myChart.setOption({
					title: {
					},
					tooltip : {
						trigger: 'axis',
						formatter: function (params,ticket,callback) { 
							return '<div><p>'+params[0].name+'</p><p>'+itemName+': '+(parseFloat(params[0].value)).toFixed(0)+'</p></div>'
						}
					},
					legend: {
					},
					toolbox: {
						feature: {
						}
					},
					grid: {
						top: '5%', 
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: false,
					},
					xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							data : data.dateArray,
							axisLabel: {
								show: false,
							},
							axisLine: {
								lineStyle:{
									color:'#acdaff'    // x轴颜色
								}
							}
						}
					],
					yAxis : [
						{
							type : 'value',  
							splitNumber: 2,  
							scale: true,  
							show:true,  
							splitLine:{  
						　　　　show:false  
					　　 	   },
							axisLabel: {
								show: false,
							},
							axisLine: {
								lineStyle:{
									color:'#acdaff'    // y轴颜色
								}
							}
						}
					],
					series : [
						{
							name:'',
							type:'line',
							stack: '总量',
							 itemStyle:{
								normal:{
									color:'#acdaff',
									show:true,
								},
							},
							/* label: {
								normal: {
									show: true,
									position: 'top'
								}
							}, */
							areaStyle: {normal: {}},
							data:data.valueArray
						}
					]
			});
		}
	
	}

	// 把数据转成EChart数据
	formatDataToEchartData(runChart) {

		let obj = {
			dateArray:[],
			valueArray:[]
		}

		if(runChart){
			let arr1 = [];
			let arr2 = [];
			for(let i in runChart){
				let dateLabel = `${i.split('.')[0]}月${i.split('.')[1]}日`;
				arr1.push(dateLabel);
				arr2.push(runChart[i]);
			}

			obj.dateArray = arr1;
			obj.valueArray = arr2;
		}
		return obj;
	}

	// 格式化热度的显示格式
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

export default Reference;