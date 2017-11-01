/**
 * 商品详情模块
 * Date: 2017/8/18
 * Author: zhuangchuhui
 */

import React from 'react';
import { connect } from 'dva';
import {  hashHistory  } from 'react-router';
import { Link, routerRedux } from 'dva/router';
import styles from './index.less'
import moment from 'moment';
import echarts from 'echarts';
import { Button, DatePicker, Spin,} from 'antd';
import DateTime from 'utils/time'; 

const { MonthPicker, RangePicker } = DatePicker;


class Index extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = { 
            startDate: DateTime.getDateOfDays(7),
            endDate: DateTime.getDateOfDays(1),
        }
    }
    
    render() {

        // 跳转链接配置
        const paths = {
            gearbest:{
                pathname:`/rival/view`,
                state:{
                    site:'gearbest',
                    cid:null,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                }
            },
            lightinthebox:{
                pathname:`/rival/view`,
                state:{
                    site:'lightinthebox',
                    cid:null,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                }
            },
            dx:{
                pathname:`rival/view`,
                state:{
                    site:'dx',
                    cid:null,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                }
            },
            tomtop:{
                pathname:`rival/view`,
                state:{
                    site:'tomtop',
                    cid:null,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                }
            },
        }


        return (
            <div className={`${styles.mainWrap} ${styles.rivalWrap}`}>
                <div className={styles.content}>
                    <div>
                        <RangePicker 
                            value={[
                                moment(this.state.startDate),
                                moment(this.state.endDate)
                            ]}
                            ranges={{ 
                                '今天': [moment(), moment()],
                                '本周': [moment(), moment().endOf('week')], 
                                '本月': [moment(), moment().endOf('month')] 
                            }} 
                            format="YYYY-MM-DD" 
                            style={{ width:210 }}
                            allowClear={false}
                            disabledDate = {this.disabledDate}
                            onChange={ this.onGetDateRange.bind(this) }
                        />
                        <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,1)}>前天</span>
                        <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,7)}>最近7天</span>
                        <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,15)}>最近15天</span>
                        <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,30)}>最近30天</span>
                        
                    </div>
                    {
                        this.props.loading?
                        <div style={{textAlign:'center',marginTop:150}}><Spin /></div>
                        :
                        <div>
                            {
                                this.props.rivalData !== null ? 
                                <div>
                                    {/* Gearbest 模块 */}
                                    <section>
                                        <div className={styles.sectionHead}> 
                                            <b>Gearbest</b> &nbsp; 在
                                            <span className={styles.colorOrange}>
                                                {
                                                    this.state.startDate == this.state.endDate? 
                                                    <span>{this.state.startDate}</span> : <span>{this.state.startDate} - {this.state.endDate}</span>
                                                }
                                            </span>
                                            共上新品<span className={styles.colorOrange}>{this.props.rivalData.site_list[0].product_count}件</span>
                                            (BG上新 <span className={styles.colorOrange}>{this.props.rivalData.bg_product_count}件</span>商品)
                                            
                                            <Link to={paths.gearbest}><Button type='primary' className={styles.fr}>查看商品</Button></Link>
                                        </div>
                                        <div>
                                            <div ref="greabestChartId" style={{display:'inline-block', width:'60%',height:250}}>data</div>
                                            <div ref="greabestPieChartId" style={{display:'inline-block', width:'40%',height:250}}>data</div>
                                        </div>
                                    </section>
                                    
                                    {/* 兰亭集势 模块 */}
                                    <section>
                                        <div className={styles.sectionHead}> 
                                            <b>兰亭集势</b> &nbsp; 在
                                            <span className={styles.colorOrange}>
                                                {
                                                    this.state.startDate == this.state.endDate? 
                                                    <span>{this.state.startDate}</span> : <span>{this.state.startDate} - {this.state.endDate}</span>
                                                }
                                            </span>
                                            共上新品<span className={styles.colorOrange}>{this.props.rivalData.site_list[1].product_count}件</span>
                                            (BG上新 <span className={styles.colorOrange}>{this.props.rivalData.bg_product_count}件</span>商品)
                                            
                                            <Link to={paths.lightinthebox}><Button type='primary' className={styles.fr}>查看商品</Button></Link>
                                        </div>
                                        <div>
                                            <div ref="ltjsChartId" style={{display:'inline-block', width:'60%',height:250}}></div>
                                            <div ref="ltjsPieChartId" style={{display:'inline-block', width:'40%',height:250}}></div>
                                        </div>
                                    </section>

                                    {/* DX 模块 */}
                                    <section>
                                        <div className={styles.sectionHead}> 
                                            <b>DX</b> &nbsp; 在
                                            <span className={styles.colorOrange}>
                                                {
                                                    this.state.startDate == this.state.endDate? 
                                                    <span>{this.state.startDate}</span> : <span>{this.state.startDate} - {this.state.endDate}</span>
                                                }
                                            </span>
                                            共上新品<span className={styles.colorOrange}>{this.props.rivalData.site_list[2].product_count}件</span>
                                            (BG上新 <span className={styles.colorOrange}>{this.props.rivalData.bg_product_count}件</span>商品)
                                            
                                            <Link to={paths.dx}><Button type='primary' className={styles.fr}>查看商品</Button></Link>
                                        </div>
                                        <div>
                                            <div ref="dxChartId" style={{display:'inline-block', width:'60%',height:250}}></div>
                                            <div ref="dxPieChartId" style={{display:'inline-block', width:'40%',height:250}}></div>
                                        </div>
                                    </section>

                                    {/* Tom Top 模块 */}
                                    <section>
                                        <div className={styles.sectionHead}> 
                                            <b>TomTop</b> &nbsp; 在
                                            <span className={styles.colorOrange}>
                                                {
                                                    this.state.startDate == this.state.endDate? 
                                                    <span>{this.state.startDate}</span> : <span>{this.state.startDate} - {this.state.endDate}</span>
                                                }
                                            </span>
                                            共上新品<span className={styles.colorOrange}>{this.props.rivalData.site_list[3].product_count}件</span>
                                            (BG上新 <span className={styles.colorOrange}>{this.props.rivalData.bg_product_count}件</span>商品)
                                            
                                            <Link to={paths.tomtop}><Button type='primary' className={styles.fr}>查看商品</Button></Link>
                                        </div>
                                        <div>
                                            <div ref="tomtopChartId" style={{display:'inline-block', width:'60%',height:250}}></div>
                                            <div ref="tomtopPieChartId" style={{display:'inline-block', width:'40%',height:250}}></div>
                                        </div>
                                    </section>
                                </div>
                                :
                                <div style={{textAlign:'center',marginTop:150}}>数据载入失败</div>
                            }
                            <div className={styles.more}>没有你关注的竞争对手? &nbsp; <Button type="primary" size='small' onClick={this.switchOpinion}>点击提需求</Button></div>
                        </div>
                    }
                </div>
            </div>
        );
        
    }

    componentDidMount(){
        // 根据时间请求数据
        this.props.dispatch({
            type: 'rival/getRivalDataByDate',
            payload: {
                startDate:DateTime.getDateOfDays(7),
                endDate:DateTime.getDateOfDays(1),
            }
        })

    }

 
    componentDidUpdate(){
        // 载入Echart图表
        if(!this.props.loading && this.props.rivalData !== null){
            this.props.rivalData.site_list.map((item,index)=>{
                switch(item.site){
                    case 'gearbest':
                        this.loadChart(item.new_list,this.refs.greabestChartId,item.site);
                        this.loadPieChart(item.category_present,this.refs.greabestPieChartId,item.site);
                        break;
                    case 'lightinthebox':
                        this.loadChart(item.new_list,this.refs.ltjsChartId,item.site);
                        this.loadPieChart(item.category_present,this.refs.ltjsPieChartId,item.site);
                        break;
                    case 'dx':
                        this.loadChart(item.new_list,this.refs.dxChartId,item.site);
                        this.loadPieChart(item.category_present,this.refs.dxPieChartId,item.site);
                        break;
                    case 'tomtop':
                        this.loadChart(item.new_list,this.refs.tomtopChartId,item.site);
                        this.loadPieChart(item.category_present,this.refs.tomtopPieChartId,item.site);
                        break;
                    
                }
            })
        
        }
    }


    /**
     * 载入折线图表
     * @param {object} chartData 
     */
    loadChart=(chartData,id,siteName)=>{

        const chartBG = echarts.init(id);

        const option = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params){
                    return params[0].axisValue+"<br/>"+
                           '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#acdaff"></span>'+
                           params[0].seriesName+': '+params[0].value + " 件 <br/>"+
                           '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ff7082"></span>'+                           
                           params[1].seriesName+': '+params[1].value+" 件";
                }
            },
            legend: {
            },
            toolbox: {
                feature: {
                }
            },
            grid: {
                top: '3%',
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data : chartData.data,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#666'   // 字体颜色
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
                    show: true,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#666'       // 字体颜色
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
                    name: `${siteName}上新数`,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                            position: 'top'
                        },
                    },
                    data:chartData.value,
                },
                {
                    name: 'BG上新数',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#ff7082',
                            show: true,
                        },
                    },
                    data:chartData.bgvalue,
                }
            ]
        }

        chartBG.setOption(option);


        // 添加点击事件，跳转链接
        chartBG.on("click", function(params){ 
            const path = {
                pathname:`/view`,
                state:{
                    site:siteName,
                    cid:null,
                    startDate: params.name,
                    endDate: params.name
                }
            }
            
            //this.props.dispatch(routerRedux.push(path)); 
            hashHistory.push(path);

        });

    }

    

    /**
     * 载入饼状图
     * @param {object} chartData 
     */
    loadPieChart(chartData,id,siteName){
        
        const chartId = echarts.init(id);
        let data = [];

        chartData.data.map((item,index)=>{
            let obj = {'name':item,'value':chartData.value[index],'cid':chartData.cid[index]};
            data.push(obj);
        })

        let option = {
            tooltip : {
                trigger: 'item',
                formatter: "占比：{d}% ({c}件)"
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: false,
            },
            color:['#baebe1','#f8a942','#42a6f8','#ffe990','#ff7082'],
            /* legend: {
                show:true,
                orient: 'vertical',
                right: '3%',
                top:'3%',
                data: chartData.data
            }, */
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '60%',
                    center: ['50%', '50%'],
                    data:data
                }
            ]
        }

        chartId.setOption(option);

        // 获取时间
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        // 添加点击事件，跳转链接
        chartId.on("click", function(params){ 
            const path = {
                pathname:`/view`,
                state:{
                    site:siteName,                  // 站点名称
                    cid:params.data.cid,            // 分类名称
                    startDate: startDate, 
                    endDate: endDate,
                }
            }
            
            hashHistory.push(path);

        });
    }

    /**
     * 获取多少天前的数据
     * @param {number} days 
     */
    onLatelyDate(days){
        
        // 获取时间范围
        let endDate = DateTime.getDateOfDays(1),                // 昨天
            startDate = DateTime.getDateOfDays(days);           // days天前的日期

        // 前天
        if(days == 1){
            endDate = DateTime.getDateOfDays(2);
            startDate = DateTime.getDateOfDays(2);
        }
        
        // 赋值
        this.setState({
            startDate:startDate,
            endDate:endDate
        });
         
        // 根据时间请求数据
        this.getRivalDataByDate({
            startDate:startDate,
            endDate:endDate
        });
    }

    /**
     * 日期控件操作
     * @param {*} date 
     * @param {*} dateString 
     */
    onGetDateRange(date,dateString){
        // 获取日期并赋值到state
        let startDate = dateString[0],
            endDate   = dateString[1];
            
        // 赋值
        this.setState({startDate:startDate,endDate:endDate});

        // 根据时间请求数据
        this.getRivalDataByDate({
            startDate:startDate,
            endDate:endDate
        });

    } 

    /**
     * 根据时间获取竞品数据
     * @param {date} startDate 
     * @param {date} endDate 
     */
    getRivalDataByDate(params){
        // 根据时间请求数据
        this.props.dispatch({
            type: 'rival/getRivalDataByDate',
            payload: {
                startDate:params.startDate,
                endDate:params.endDate
            }
        })
    }

    /**
     * 限制日期控件只能选今天或今天前的日期
     * @param {*} current 
     */
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    
    switchOpinion=()=>{
        this.props.dispatch({
            type: 'app/switchOpinion',
        })
    }
}
 
function mapStateToProps(state){
    return {...state.rival,...state.app};
}

export default connect(mapStateToProps)(Index)
