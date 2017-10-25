/**
 * 商品详情模块
 * Date: 2017/8/18
 * Author: zhuangchuhui
 */

import React from 'react';
import styles from './detail.less'
import moment from 'moment';
import echarts from 'echarts';
import { Button, Icon, DatePicker, Select, Tag, Cascader, Table, Spin} from 'antd';
import { Link } from 'dva/router';
import DateTime from 'utils/time'; 
import ImageRelate from './relate.png';

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;


class Detail extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            startDate: DateTime.getDateOfDays(7),
            endDate: DateTime.getDateOfDays(1),
            competePid: '',
            competeSite: '',
            optionValuesByBg:[],
            optionValuesByOther:[],

            competeAttrInfos:null,   // 关联商品属性
        }
    }
    
    render() {
        
        const columns = [
            { title: '平台', dataIndex: 'name', key: 'name',width:'20%'},
            { title: '价格', dataIndex: 'price', key: 'price',width:'20%',render:(text,record)=>(
                <div>
                    $ {record.price}
                </div>
            )},
            { title: '销量', dataIndex: 'sales', key: 'sales',width:'20%'},
            { title: '关注数', dataIndex: 'favorites', key: 'favorites',width:'20%'},
            { title: '提问数', dataIndex: 'questions', key: 'questions',width:'20%'},
        ];

        const columnsPrice = [
            { title: '', dataIndex: 'name', key: 'name',width:'15%'},
			/* { title: '有效时间', dataIndex: 'date', key: 'date',width:'15%',
			render:(text,record)=>(
				<div>
                    <p>{record.is_date == '有效'?<span style={{color:'green'}}>{record.is_date}</span>
                            :<span style={{color:'red'}}>{record.is_date}</span>}</p>
					<p>{record.date}</p>
				</div>
			)}, */
            { title: '中仓', dataIndex: 'price', key: 'price' ,width:'10%',render:(text,record)=>(
                <div>
                    {
                            record.is_date == '无效'?
                            <div style={{color:'#999'}}>
                                <p>{record.is_date}</p>
                                <p>{record.price=='--'?record.price:`$ ${record.price}`}</p>
					            <p>{record.date}</p>
                            </div>
                            :
                            <div>
                                 {record.is_date == '当天售价'?
                                 <div style={{color:'#489200'}}>
                                    <p>{record.is_date}</p>
                                    <p>{record.price=='--'?record.price:`$ ${record.price}`}</p>
                                    <p>{record.date}</p>
                                 </div>
                                 :
                                 <div>
                                    <p>{record.is_date}</p>
                                    <p>{record.price=='--'?record.price:`$ ${record.price}`}</p>
                                    <p>{record.date}</p>
                                 </div>
                                 }
                            </div>
                        }
                    

                </div>

            )},
            { title: 'HK仓', dataIndex: 'hk_price', key: 'hk' ,width:'10%',render:(text,record)=>(
                <div>{record.hk_price=='--'?record.hk_price:`$ ${record.hk_price}`}</div>
            )},
            { title: '美仓', dataIndex: 'usa_price', key: 'usa_price',width:'10%',render:(text,record)=>(
                <div>{record.usa_price=='--'?record.usa_price:`$ ${record.usa_price}`}</div>
            )},
            { title: '英仓', dataIndex: 'uk_price', key: 'uk' ,width:'10%',render:(text,record)=>(
                <div>{record.uk_price=='--'?record.uk_price:`$ ${record.uk_price}`}</div>
            )},
            { title: '澳仓', dataIndex: 'au_price', key: 'au' ,width:'10%',render:(text,record)=>(
                <div>{record.au_price=='--'?record.au_price:`$ ${record.au_price}`}</div>
            )},
            { title: '法仓', dataIndex: 'fr_price', key: 'fr' ,width:'10%',render:(text,record)=>(
                <div>{record.fr_price=='--'?record.fr_price:`$ ${record.fr_price}`}</div>
            )},
            { title: '德仓', dataIndex: 'de_price', key: 'de' ,width:'10%',render:(text,record)=>(
                <div>{record.de_price=='--'?record.de_price:`$ ${record.de_price}`}</div>
            )},
        ];

        return (
            <div className={`${styles.mainWrap} ${styles.goodsDetailWrap}`}>
                <div className={styles.goodsAttribute}>
                    <div className={styles.sku}>
                        <b>{this.props.sku}</b>
                    </div>
                    {
                        !this.props.goodsLoading?
                        <Spin style={{width:'100%',height:50,marginTop:20}}/>
                        :
                        <div>
                            {
                                this.props.goods?
                                <div className={styles.clear}>
                                    <div className={`${styles.fl} ${styles.image}`}>
                                        <img src={this.props.goods.products_image} />
                                    </div>
                                    <div className={`${styles.detailBox}`}>
                                        <div className={styles.goodsTitle}>
                                            <span className={styles.tips}>{ this.getProductsStatus(this.props.goods.products_status) }</span> 
                                            <h2><a href={this.props.goods.products_url} target="_blank">{this.props.goods.products_name}</a></h2>
                                        </div>
                                        <div className={styles.clear}>
                                            <div className={`${styles.fl} ${styles.attrLeft}`}>
                                                <p className={styles.clear}>
                                                    <span className={styles.fl}>品牌：<a href={this.props.goods.brand_url} target="_blank">{this.props.goods.brand}</a></span>
                                                    <span className={styles.fr}>上架时间：{this.props.goods.products_date_added}</span>
                                                </p>
                                                <div>分类：
                                                    {
                                                        this.props.goods.cate_list?this.props.goods.cate_list.map((item,index)=>(
                                                            <span>
                                                                <a href={item.url} target="_blank">{item.name}</a> 
                                                                {
                                                                    (index+1) < this.props.goods.cate_list.length?<span>></span>:null
                                                                }
                                                            </span>
                                                        )):null
                                                    }
                                                    
                                                </div>
                                            </div>
                                            <div className={`${styles.fr} ${styles.attrRight}`}>
                                                <ul>
                                                    <li>
                                                        <p>昨天价格：$ {this.props.goods.finalPrice }</p>
                                                        <p>加购数：{this.props.goods.basket }</p>
                                                    </li>
                                                    <li>
                                                        <p>平均转化率：{this.props.goods.changeRate }</p>
                                                        <p>关注数：{this.props.goods.favorites }</p>
                                                    </li>
                                                    <li>
                                                        <p>毛利率：{this.props.goods.maoriRate }</p>
                                                        <p>评论数：{this.props.goods.reviews }</p>
                                                    </li>
                                                    <li>
                                                        <p>库存：{this.props.goods.stocks }</p>
                                                        <p>提问数：{this.props.goods.questions }</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :<div style={{width:'100%',height:80,lineHeight:'50px',textAlign:'center'}}>
                                    木有数据
                                </div>
                            }
                        </div>
                    }
                    
                </div>

                <div className={styles.detailContent}>
                    {/* 菜单 star */}
                    {/* <div className={styles.detailMenu}>
                        <ul>
                            <li>销售情况</li>
                            <li>运营情况</li>
                            <li>商品特征</li>
                            <li className={styles.current}>价格对比</li>
                        </ul>
                    </div> */}
                    {/* 菜单 end */}
                    

                    <div className={styles.content}>

                        {
                            !this.props.goodsLoading?
                            <Spin style={{width:'100%',height:100,marginTop:45}}/>
                            :
                            <section>
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
								<div className={styles.clear}>
									<div className={styles.echartBox} >
										<div className={styles.changeAttr}>
											{
												// 载入BG属性下拉列表
												this.props.attrInfo?
												this.props.attrInfo.map((item,index)=>{
													return <Select className={styles.select} style={{minWidth:100}} defaultValue={item.name}  onChange={this.handleChangeByBG.bind(this,index)}>
														{
															item.children.map((item2,index2)=>{
																return <Option value={item2.options_values_id.toString()} key={'o1_'+index2}>{item2.value_name}</Option>
															})
														}
													</Select>
												})
												:null
											}

											{
												this.props.goods?
												<Button onClick={
													this.onGoodsOtherRunChart.bind(this,
													{
														pid:this.props.goods.products_id,
														site:'banggood',
														startDate:this.state.startDate,
														endDate:this.state.endDate,
														optionValues:this.state.optionValuesByBg.join(',')
													})}>确定</Button>
												:null
											}
											{
												this.props.chartLoading?
												<div ref="chartBG" style={{width:'100%',height:250,marginTop:20}}></div>
												:<Spin style={{width:'100%',height:150,marginTop:100}}/>
											}
											
										</div>
										
									</div>
									<div className={styles.echartBox} >
										<div className={styles.changeAttr}>
										{
												this.props.relateInfo?
												<div>
													{/* 竞品切换 */}
													<Select className={styles.select} style={{minWidth:100}}  defaultValue={this.props.relateInfo.relateInfoByMenu[0].name} onChange={this.onChangeRelateInfo.bind(this)}>
														{
															this.props.relateInfo.relateInfoByMenu.map((item,index)=>{
																return <Option value={index.toString()} key={`relate_${index}`}>{item.name}</Option>
															})
														}
													</Select>

													{
														// 载入属性下拉表
														this.state.competeAttrInfos?
														this.state.competeAttrInfos.map((item,index)=>{
															return <Select className={styles.select} style={{minWidth:100}} defaultValue={item.name} onChange={this.handleChangeByOther.bind(this,index)}>
															{
																item.values.map((item2,index2)=>{
																	return <Option value={item2.options_values_id} key={`ky_${index2}`}>{item2.value_name}</Option>
																})
															}
														</Select>
														})
														:null
														
													}
												
													{
														this.props.goods?
														<Button onClick={
															this.onGoodsOtherRunChart.bind(this,{
															pid:this.state.competePid,
															site:this.state.competeSite,
															startDate:this.state.startDate,
															endDate:this.state.endDate,
															optionValues:this.state.optionValuesByOther.join(',')
														})}>确定</Button>
														:null
													}
													{
														this.props.chartLoading?
														<div ref="chartCompete" style={{width:'100%',height:250,marginTop:20}}></div>
														:<Spin style={{width:'100%',height:150,marginTop:100}}/>
													}
													
												</div>
												:
												<div className={styles.noRelateStatus}>
                                                    <img src={ImageRelate} />
													<p>该商品未关联竞品，无法查看竞品数据。</p>
													<Link  to={"/create/"+this.props.sku}><Button type="primary">马上关联</Button></Link>
												</div>
											}
										</div>
									</div>
								</div>
                            </section>
                        }

                        {/* 竞品对比 start */}
                        {
                            this.props.relateInfo?
                            <section className={styles.sectionTable}>
                                <div className={styles.title}>竞品对比</div>
                                <div className={styles.tableWrap}>
                                    <Table
                                        columns={columns}
                                        dataSource={this.props.compareInfoList}
                                        pagination={false}
                                    />
                                </div>
                            </section>
                            :null
                        }
                        {/* 竞品对比 end */}

                        
                        {/* 价格汇总 start */}
                        <section className={styles.sectionTable}>
                            <div className={styles.title}>价格汇总</div>
                            {
                            this.props.priceList!==null?
                            <div className={styles.tableWrap}>
                                <Table
                                    loading={this.props.priceLoading}
                                    columns={columnsPrice}
                                    dataSource={this.props.priceList} 
                                    pagination={false}
                                />
                            </div>:null
                            }
                        </section>
                            
                        {/* 价格汇总 end */}

                    </div>
                </div>
            </div>
        );
        
    }

    /**
     * 格式化商品出售状态
     * @param {number} status 
     */
    getProductsStatus(status){
        switch(status){
            case "0" :
                return '停售';
                break;
            case "1" :
                return '在售';
                break;
            case "2" :
                return '下架';
                break;
            default:
                return '未知'
        }
    }

    /**
     * 载入BG图表
     * @param {object} chartData 
     */
    loadChart(chartData) {
        // 如果ID元素还没生成
        if(!this.refs.chartBG){
            return
        }

        const chartBG = echarts.init(this.refs.chartBG);
        
        const option = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    let dataIndex = params[0].dataIndex;
                    const dataPrice = chartData.nameArray[dataIndex].split('|')[0];
                    const dataType = chartData.nameArray[dataIndex].split('|')[1];
                    const dataSales = chartData.nameArray[dataIndex].split('|')[2];
                    return `<div><p>价格：${dataPrice}</p><p>类型：${dataType}</p><p>销量：${dataSales}</p></div>`;
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
                    data : chartData.dateArray,
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
                    name: '价格',
                    type: 'line',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                        },
                    },
                    areaStyle: { normal: {} }, 
                    data:chartData.priceArray,
                }
            ]
        }

        chartBG.setOption(option);
    }

    /**
     * 载入关联商品图表
     * @param {object} chartData 
     */
    loadCompeteChart(chartData) {
        // 如果ID元素还没生成
        if(!this.refs.chartCompete){
            return
        }

        const chartCompete = echarts.init(this.refs.chartCompete);
        
        const optionCompete = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    let dataIndex = params[0].dataIndex;
                    return `<div>${chartData.nameArray[dataIndex]}</div>`;
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
                    data : chartData.dateArray,
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
                    name: '价格',
                    type: 'line',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                        },
                    },
                    areaStyle: { normal: {} }, 
                    data:chartData.priceArray,
                }
            ]
        }

        chartCompete.setOption(optionCompete);
    }

    /**
     * 关联商品切换
     * @param {number} value 
     */
    onChangeRelateInfo(value,params){
        // 图表
        //this.loadCompeteChart(this.formatChartData(this.props.relateInfo.relateInfoRunChart[value].runChart));

        this.setState({
            competeSite:this.props.relateInfo.relateInfoByMenu[value].name,
            competePid:this.props.relateInfo.relateInfoByMenu[value].pid,
            competeAttrInfos:this.props.relateInfo.relateInfoAttrInfo[value],
        })
    }

    /**
     * 格式化图表数据
     * @param {object} chartData 
     */
    formatChartData(chartData){
        let dateArray  = [],
            priceArray = [],
            nameArray  = [];

        if(chartData.priceSet){
            for(let i in chartData.priceSet){
                for(let item in chartData.priceSet[i]){
                   switch(item){
                        case 'price':
                            priceArray.push(chartData.priceSet[i][item]);
                            break;
                        case 'name':
                            nameArray.push(chartData.priceSet[i][item]);
                            break;
                        case 'date':
                            dateArray.push(chartData.priceSet[i][item]);
                            break;
                    }

                }

            }
        }

        return {
            dateArray: dateArray,
            priceArray: priceArray,
            nameArray: nameArray
        }
    }

    /**
     * 获取多少天前的数据
     * @param {number} days 
     */
    onLatelyDate(days){
        
        // 获取时间范围
        let yesterday = DateTime.getDateOfDays(1),                // 昨天
            latelyDay = DateTime.getDateOfDays(days);           // days天前的日期

        // 前天
        if(days == 1){
            yesterday = DateTime.getDateOfDays(2);
            latelyDay = DateTime.getDateOfDays(2);
        }
        
        // 赋值
        this.setState({
            startDate:latelyDay,
            endDate:yesterday
        });
        
         
        this.getPriceDataByDate(latelyDay,yesterday);
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

        
        this.getPriceDataByDate(startDate,endDate);

    }

    
    /**
     * 根据时间获取BG、竞品的数据
     */
    getPriceDataByDate(startDate,endDate){

        // Bg
        let paramsBg =  {  
            pid:this.props.goods.products_id,
            site:'banggood',
            startDate:startDate,
            endDate:endDate,
            optionValues:this.state.optionValuesByBg.join(',')
        },
        // 竞品
        paramsCompete =  {
            pid:this.state.competePid,
            site:this.state.competeSite,
            startDate:startDate,
            endDate:endDate,
            optionValues:this.state.optionValuesByOther.join(',')
        }

        
        // 请求数据
        this.props.onGoodsOtherRunChart(paramsBg);
        this.props.onGoodsOtherRunChart(paramsCompete);

        // 载入竞品图表
        this.timeout(2000).then((value) => {
            let relateInfoNewChart = this.props.relateInfoNewChart;
            if(relateInfoNewChart !== null && relateInfoNewChart.runChart !== undefined)
            {
                this.loadCompeteChart(this.formatChartData(relateInfoNewChart.runChart));
            }
        });

    }

    /**
     * 限制日期控件只能选今天或今天前的日期
     * @param {*} current 
     */
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    /**
     * 在数关联商品的属性
     * @param {object} attrInfo 
     */
    loadAttrInfo(attrInfo){
        return (
                <span>
                {
                    attrInfo.values?
                    <Select className={styles.select} style={{minWidth:100}} key={attrInfo.option_id} defaultValue={attrInfo.name} onChange={this.handleChangeByOther.bind(this)}>
                        {
                            attrInfo.values.map((item2,index2)=>{
                                return <Option value={item2.options_values_id.toString} key={`ky1_${index2}`}>{item2.value_name}</Option>
                            })
                        }
                    </Select>
                    :null
                }
                </span>
        )
    }

    /**
     * 获取BG模块的属性
     * @param {string} value 
     */
    handleChangeByBG(index,value){
        let optionValues = this.state.optionValuesByBg;
        optionValues[index] = value; 
        this.setState({
            optionValuesByBg:optionValues,
        });
    }
    
    /**
     * 获取竞品模块的属性
     * @param {string} value 
     */
    handleChangeByOther(index,value) {
        let optionValues = this.state.optionValuesByOther;
        optionValues[index]= value;
        this.setState({
            optionValuesByOther:optionValues,
        });
    }

    /**
     * 根据参数请求最新数据
     * @param {object} params 
     */
    onGoodsOtherRunChart(params){
        // 请求数据
        this.props.onGoodsOtherRunChart(params);
        
        if(params.site !== 'banggood'){
            // 载入竞品图表
            this.timeout(2000).then((value) => {
                let relateInfoNewChart = this.props.relateInfoNewChart;
                if(relateInfoNewChart !== null && relateInfoNewChart.runChart !== undefined)
                {
                    this.loadCompeteChart(this.formatChartData(relateInfoNewChart.runChart));
                }
            });
            
        }else{
			this.timeout(2000).then((value) => {
				this.loadCompeteChart(this.formatChartData(this.props.relateInfo.relateInfoRunChart[0].runChart));
            });
		}
    }


    syncPropState=()=>{
        
        if(this.props.runChart){
            this.loadChart(this.formatChartData(this.props.runChart));
        }

        if(this.props.relateInfo !== null){
            this.state.competeSite=this.props.relateInfo.relateInfoByMenu[0].name;
            this.state.competePid=this.props.relateInfo.relateInfoByMenu[0].pid;
            this.state.competeAttrInfos=this.props.relateInfo.relateInfoAttrInfo[0];
            
            this.loadCompeteChart(this.formatChartData(this.props.relateInfo.relateInfoRunChart[0].runChart));
         }
    }
    

    /**
     * 异步定时器
     * @param {时间} ms 
     */
    timeout(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    }

    

    componentDidMount(){

        //this.timeout(3000).then((value) => {
            /* if(this.props.relateInfo !== null){
               this.setState({
					competeSite:this.props.relateInfo.relateInfoByMenu[0].name,
					competePid:this.props.relateInfo.relateInfoByMenu[0].pid,
					competeAttrInfos:this.props.relateInfo.relateInfoAttrInfo[0],
                })

                this.loadCompeteChart(this.formatChartData(this.props.relateInfo.relateInfoRunChart[0].runChart));
            } */
			
        //});
    }


    componentDidUpdate(){
        // Echarts图
        this.syncPropState();
    }



}


export default Detail;
