/**
 * BG关联表
 * Date: 2017-06-19
 * Author: zhuangchuhui
 */

import React from 'react';
import { hashHistory  } from 'react-router';
import { Link } from 'dva/router';
import styles from './goods-list.less';
import moment from 'moment';
import echarts from 'echarts';
import {
    Table, Pagination, Icon, Menu, Dropdown, Button, message, Modal, DatePicker,
    Checkbox, Select, Radio, Spin, Row, Col } from 'antd';
import DateTime from 'utils/time'; 

const { Column, ColumnGroup } = Table;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option; 
const RadioGroup = Radio.Group;


class GoodsList extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {

            //主商品趋势图
            goodsEchartVisible:false,
            goodsEchartPid:0,
            goodsEchartRadioValue:0,
            defaultStartDate: DateTime.getDateOfDays(30), 
            defaultEndDate: DateTime.getDateOfDays(1),

            //对比
            goodsContrastVisible:false,
            goodsContrastSku:null,
            goodContrastData:[],
            
        }
    }

    render() {
        
        // 主表Columns
        const tableColumns = [
            {
                title: "主图",
                key: "img_url",
                render: (text, record) => (
                    <span>
                        {   // 子表不显示该项
                            !record.isChildren?
                            <Link to={"/detail/"+record.sku}>
                                    <img src={ record.img_url} className={ styles.img } />
                            </Link>
                            :<div style={{position:'absolute',top:'-1px',left:0,width:'100%',borderTop:'1px solid #fff'}}> 
                            </div>
                        }
                       
                   </span>
                    
                ),
            }, {
                title: "编码",
                dataIndex: "sku",
                key: "sku",
                render:(text,record) => (
                    <div >
                        {
                            !record.isChildren?
                            <div>
                                <a href={record.product_url} target="_blank">
                                    <p>{record.sku}</p>
                                    <p>{record.url_id}</p>
                                </a>
                                
                                <p style={{ marginTop:5}}>
                                    {   
                                        // 是否关联，如果为关联，则显示关联连接
                                        record.relate_sku==0?
                                        <Link  to={"/goods/relevance/"+record.sku}> <Icon type="exclamation-circle-o" style={{ color:'red',fontSize:14 }}/> &nbsp;未关联</Link>
                                        :
                                        <Link  to={"/goods/relevance/"+record.sku}> <Icon type="check-circle-o" style={{ color:'#79bb51',fontSize:14 }}/>&nbsp;已关联</Link>
                                    }
                                </p>
                            </div>
                            :
                            <div style={{position:'absolute',top:'-1px',left:0,width:'100%',borderTop:'1px solid #fff'}}> 
                            </div> 
                        }
                        
                   </div>
                )
            }, {
                title: "操作",
                dataIndex: "pid",
                render: (text, record) => (
                   <span>
                        {
                            !record.isChildren?
                            <Dropdown overlay={this.tableColumnsMenu(record)}>
                                <Button>
                                    操作 <Icon type="down" />
                                </Button>
                            </Dropdown>
                            :
                            <div style={{position:'absolute',top:'-1px',left:0,width:'100%',borderTop:'1px solid #fff'}}> 
                            </div> 
                        }
                   </span>
                ),
            },{
                title: "上架时间",
                dataIndex: "products_date_added",
                key: "products_date_added",
                render:(text,record) => (
                    <div>
                        {
                            record.products_date_added? 
                            <div>
                                <p>{record.products_date_added.split(' ')[0]}</p>
                                <p>{record.products_date_added.split(' ')[1]}</p>
                            </div>
                            :null
                        }
                        
                    </div>
                )
            }, {
                title: "站点",
                dataIndex: "site",
                key: "site",
            }, {
                title: "标题",
                dataIndex: "pname",
                key: "pname",
                className: styles.columnTitle,
                render:(text,record) => (
                    <div>
                        <a href={record.product_url} target="_blank">{record.pname}</a>
                    </div>
                )
            }, {
                title: "价格",
                dataIndex: "price",
                sorter: true,
                render:(text,record)=>(
                    <p>$ {record.price}</p>
                )
            }, {
                title: "销量",
                dataIndex: "sales",
                key: "sales",
                sorter: (a, b) => a.sales - b.sales,
            }, {
                title: "评分",
                dataIndex: "score",
                sorter: true
            }, {
                title: "评论数",
                dataIndex: "reviews",
                sorter: true
            }, {
                title: "关注数",
                dataIndex: "favorites",
                sorter: true
            }, {
                title: "提问数",
                dataIndex: "questions",
                 sorter: true
            }, {
                title: "类目树",
                dataIndex: "cateName",
                key: "cateName",
                className: styles.columnCate,
                width:250,
                render:(text,record) => (
                    <div className={styles.cateName}>
                    {
                        record.cateName?
                        record.cateName.split('>').map((item,index) => <p key={index}>{item}</p>)
                        :
                        record.cateName
                    }
                    </div>
                )
            },
        ]

        return (
            <div className={ styles.main }>

				{ /* 操作栏 start*/ }
            	<div className={ styles.clear } style={{ paddingBottom:20 }}>

				    {/*<Button className={styles.fr} onClick={ this.showCustomRowModal }>自定义列</Button>*/}
            		{/*<Button className={styles.fr} onClick={ this.showCustomGoodsModal } style={{marginRight:10}}>自定竞品</Button>*/}
            		<Link to='/goods/relevance' className={`${styles.fr}`}><Button>创建关系</Button></Link>
                    
            	</div>
            	{ /* 操作栏 end*/ }
                
            	<div className={ styles.tableWrap }>
                    
                    
					<Table 
						dataSource={ this.props.list }
						loading={ this.props.loading } 
						pagination={false} 
						columns={tableColumns}
                        rowKey={record => `${record.key_id}` }
                        onChange={this.handleTableChange}
						>
						
					  </Table>
					
					
					<div className={styles.piginationWrap}>
                        {
                            this.props.page?
                            <Pagination
                            className="ant-table-pagination"
                            showQuickJumper 
                            total={parseInt(this.props.page.count)} 
                            current={this.props.page.page}
                            pageSize={this.props.page.pageSize}
                            onChange={this.props.changePagination.bind(this)}
                            />:null
                        }
					</div>

				</div>

                {/*主商品趋势图弹框 star*/}
                <Modal
                    title="主体商品的趋势图"
                    key="modal1"
                    visible={this.state.goodsEchartVisible}  
                    onCancel={this.hideGoodsEchartModal} 
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    width={'70%'}
                    >
                    <div>
                        <div>
                            <div style={{display:'inline-block', height:50, width:'50%',verticalAlign:' top',padding:'0 5%'}}>
                                <RadioGroup onChange={this.onChangeEchartItem.bind(this)} value={this.state.goodsEchartRadioValue}>
                                    <Radio value={0} style={{margin:'0 20px 10px 0'}} key='randio1'>价格</Radio>
                                    <Radio value={1} style={{margin:'0 20px 10px 0'}} key='randio2'>销量</Radio>
                                    <Radio value={2} style={{margin:'0 20px 10px 0'}} key='randio3'>评分</Radio>
                                    <Radio value={3} style={{margin:'0 20px 10px 0'}} key='randio4'>评论</Radio>
                                    <Radio value={4} style={{margin:'0 20px 10px 0'}} key='randio5'>问答</Radio>
                                    <Radio value={5} style={{margin:'0 20px 10px 0'}} key='randio6'>关注</Radio>
                                </RadioGroup>
                            </div>
                            <div style={{display:'inline-block', height:50, width:'40%'}}>
                                <RangePicker 
                                    onChange={ this.getGoodsEcharData }
                                     value={[
                                        moment(this.state.defaultStartDate),
                                        moment(this.state.defaultEndDate)
                                    ]}
                                    format="YYYY-MM-DD" 
                                    style={{width:240, margin:'0 auto'}}
                                    ref='echartTime'
                                    disabledDate = {this.disabledDate}
                                    allowClear={false}
                                />
                                <span className={styles.lateDateWrap}>
                                    <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,7)}>最近7天</span>
                                    <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,15)}>最近15天</span>
                                    <span className={styles.lateDate} onClick={this.onLatelyDate.bind(this,30)}>最近30天</span>
                                </span>
                            </div>
                        </div>
                        <div style={{width:'100%',height:550,position:'relative'}}>
                            {
                                this.props.goodsEchartDataLoading==false?
                                <div style={{width:'100%',height:550,textAlign:'center',position:'absolute',background:'rgba(255,255,255,0.7)',zIndex:1000}}>
                                    <Spin tip="Loading..." style={{ marginTop:250 }}/>
                                </div>
                                :null
                            }
                            <div ref='echartId' style={{width:'100%',height:500,margin:'0 auto'}}></div>
                            
                        </div>
                    </div>
                </Modal>
                {/*主商品趋势图弹框 end*/}


                {/* 商品对比弹框 star*/}
                <Modal
                    title="对比（多个商品对比模式）"
                    key="modal2"
                    visible={this.state.goodsContrastVisible}
                    onCancel={this.hideGoodsContrastTable}
                    footer={null}
                    width={'70%'}
                    >
                    {
                        this.goodsContrastTable()
                    }
                </Modal>
                {/* 商品对比弹框 end*/}
			</div>
        )
    }

    
    
    // 数据变动，渲染完成后，执行
    componentDidUpdate(prevProps, prevState) {

         // 主商品趋势图载入
       if (this.props.goodsEchartData) {
            this.loadEchart(this.props.goodsEchartData.seriesData[this.state.goodsEchartRadioValue]);
        }
        
        // 对比商品趋势图载入
        /* if (this.props.goodContrastDataLoading) {

            this.timeout(1000).then((value) => {
                  this.eachEcharts();
            });
        } */
    }


    // 异步定时器
    timeout = (ms) => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    }

    // 获取表格的排序、筛选信息，并进行排序
    handleTableChange = (pagination, filters, sorter) =>{
        if(sorter.order == 'ascend'){
            this.props.changeTableSort(`${sorter.field}-asc`);
        }else if(sorter.order == 'descend'){
            this.props.changeTableSort(`${sorter.field}-desc`);
        }
    }


    // 主表操作菜单
    tableColumnsMenu = (record) => {
        return (
            <Menu onClick={this.onClickSelct.bind(this,record)}>
                <Menu.Item key="0">
                  <a key="cd_1" href="javascript:;">对比</a>
                </Menu.Item>
                <Menu.Item key="1">
                  <a key="cd_2" href="javascript:;">趋势图</a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a key="cd_3" href="javascript:;">详情</a>
                </Menu.Item>
            </Menu>
        )
    }
    
    // 对比商品模块
    goodsContrastTable = () => {
        return(
            <div className={styles.contrastTableWrap}>
                {    
                    this.props.goodContrastDataLoading == false?
                    <div style={{width:'100%',height:500,textAlign:'center',background:'rgba(255,255,255,0.5)'}}>
                        <Spin tip="Loading..." style={{ marginTop:250 }}/>
                    </div>
                    :
                    <div>
                        {
                            this.props.goodContrastData?
                            <Row>
                                <Col span={4}>
                                    <ul className={styles.tableColTitle}>
                                        <li>商品首图</li>
                                        <li>站点名称</li>
                                        <li>类目树</li>
                                        <li>属性</li>
                                        <li>当前价格</li>
                                        <li>30天均价</li>
                                        <li>总销量</li>
                                        <li>30天销量</li>
                                        <li>关注量（收藏量）</li>
                                        <li>评论数</li>

                                        <li className={ styles.chartWrap}>价格7天趋势图</li>
                                        <li className={ styles.chartWrap}>销量7天趋势图</li>
                                        <li className={ styles.chartWrap}>评论7天趋势图</li>
                                    </ul>
                                </Col>
                                {/*BG 商品*/}
                                <Col span={Math.floor(20/(this.props.goodContrastData.relateInfo.length+1))}>
                                        <ul className={styles.tableCol}>
                                            <li><img src={this.props.goodContrastData.info.img_url}/></li>
                                            <li>{this.props.goodContrastData.info.site}</li>
                                            <li title={this.props.goodContrastData.info.cateName}>{this.props.goodContrastData.info.cateName}</li>
                                            <li title={this.props.goodContrastData.info.attrName}>{this.props.goodContrastData.info.attrName}</li>
                                            <li>{this.props.goodContrastData.info.price}</li>
                                            <li>{this.props.goodContrastData.info.thirtyPrice}</li>
                                            <li>{this.props.goodContrastData.info.sales}</li>
                                            <li>{this.props.goodContrastData.info.thirtySales}</li>
                                            <li>{this.props.goodContrastData.info.favorites}</li>
                                            <li>{this.props.goodContrastData.info.reviews}</li>

                                            <li className={ styles.chartWrap}><div ref='priceSet' style={{width:200,height:100,margin:'0 auto'}}></div></li>
                                            <li className={ styles.chartWrap}><div ref='salesSet' style={{width:200,height:100,margin:'0 auto'}}></div></li>
                                            <li className={ styles.chartWrap}><div ref='reviewSet' style={{width:200,height:100,margin:'0 auto'}}></div></li>

                                        </ul>
                                </Col>
                                {/*关联的商品*/}
                                {
                                    this.props.goodContrastData.relateInfo.map((item,index) => {
                                        // echart ID 配置
                                        let sets = [];
                                        switch(index){
                                            case 0:
                                                sets = ['priceSet1','salesSet1','reviewSet1'];
                                                break;
                                            case 1:
                                                sets = ['priceSet2','salesSet2','reviewSet2'];
                                                break;
                                            case 2:
                                                sets = ['priceSet3','salesSet3','reviewSet3'];
                                                break;
                                            case 3:
                                                sets = ['priceSet4','salesSet4','reviewSet4'];
                                                break;
                                            
                                        }

                                            return(
                                                <Col span={Math.floor(20/(this.props.goodContrastData.relateInfo.length+1))}>
                                                    <ul className={styles.tableCol}>
                                                        <li><img src={item.img_url}/></li>
                                                        <li>{item.site}</li>
                                                        <li title={item.cateName}>{item.cateName}</li>
                                                        <li title={item.attrName}>{item.attrName}</li>
                                                        <li>{item.price}</li>
                                                        <li>{item.thirtyPrice}</li>
                                                        <li>{item.sales}</li>
                                                        <li>{item.thirtySales}</li>
                                                        <li>{item.favorites}</li>
                                                        <li>{item.reviews}</li>

                                                        <li className={ styles.chartWrap}>
                                                            <div ref={ sets[0] } style={{width:200,height:100,margin:'0 auto'}}></div>
                                                        </li>
                                                        <li className={ styles.chartWrap}>
                                                            <div ref={sets[1]} style={{width:200,height:100,margin:'0 auto'}}></div>
                                                        </li>
                                                        <li className={ styles.chartWrap}>
                                                            <div ref={sets[2]} style={{width:200,height:100,margin:'0 auto'}}></div>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            )

                                    })  
                                }
                            </Row>
                            :
                            <div style={{textAlign:'center',paddingTop:250}}>
                                <p>你要对比的商品还在天涯海角，试试把TA寻回呗。</p>
                                <Link  to={"/goods/relevance/"+this.state.goodsContrastSku}>点击试试</Link>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }

    // 显示对比数据弹框
    showGoodsContrastTable = (pid,sku) => {

        this.setState({
            goodsContrastVisible: true,
            goodsContrastSku:sku
        });

        // 请求数据
        this.props.getBgProductContrast(pid);


        this.timeout(3000).then((value) => {
              this.eachEcharts();
        });

    }

    // 隐藏对比数据弹框
    hideGoodsContrastTable = () => {
        
        this.props.clearGoodsContrastData();

        this.setState({
            goodsContrastVisible: false,
        })
    }

    // 对比商品Echart图载入
    eachEcharts = () => {

        // BG 趋势图
        if (this.refs.priceSet) {
            this.loadGoodContrastEchart(this.refs.priceSet,this.props.goodContrastData.info.priceSet,'价格');
            this.loadGoodContrastEchart(this.refs.salesSet,this.props.goodContrastData.info.salesSet,'销量');
            this.loadGoodContrastEchart(this.refs.reviewSet,this.props.goodContrastData.info.reviewSet,'评论');
        }

        // 关联商品Echart图，目前最多只显示两个关联
        if (this.props.goodContrastData.relateInfo) {
            this.props.goodContrastData.relateInfo.map((item,index) => {
                
                if (index == 0) {
                    this.loadGoodContrastEchart(this.refs.priceSet1,item.priceSet,'价格');
                    this.loadGoodContrastEchart(this.refs.salesSet1,item.salesSet,'销量');
                    this.loadGoodContrastEchart(this.refs.reviewSet1,item.reviewSet,'评论');
                }
                if (index == 1) {
                    this.loadGoodContrastEchart(this.refs.priceSet2,item.priceSet,'价格');
                    this.loadGoodContrastEchart(this.refs.salesSet2,item.salesSet,'销量');
                    this.loadGoodContrastEchart(this.refs.reviewSet2,item.reviewSet,'评论');
                }
                if (index == 2) {
                    this.loadGoodContrastEchart(this.refs.priceSet3,item.priceSet,'价格');
                    this.loadGoodContrastEchart(this.refs.salesSet3,item.salesSet,'销量');
                    this.loadGoodContrastEchart(this.refs.reviewSet3,item.reviewSet,'评论');
                }
                if (index == 3) {
                    this.loadGoodContrastEchart(this.refs.priceSet4,item.priceSet,'价格');
                    this.loadGoodContrastEchart(this.refs.salesSet4,item.salesSet,'销量');
                    this.loadGoodContrastEchart(this.refs.reviewSet4,item.reviewSet,'评论');
                }
            })
        }
    }

    // 载入对比商品数据
    loadGoodContrastEchart = (id,seriesData,textName) => {
        if (id) {
            // 初始化Echart
            let myChart = echarts.init(id);
            // 获取日期表
            let sevenDays = this.props.goodContrastData.info.sevenDays

            // 绘制图表
            myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter:function(params,ticket,callback){
                            return `<div style="text-align:left"><p>时间: ${params[0].axisValueLabel}</p><p>${textName}: ${params[0].value}</p></div>`;
                        }
                    },
                    grid: {
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        top:'5%',
                        containLabel: true
                    },
                    legend: {
                    },
                    xAxis: {
						show: true,
						axisLabel: {
							show: false,
							textStyle: {
                                color: '#acdaff',   // x轴字体颜色
                                fontSite:6,
							}
						},
						axisLine: {
							lineStyle: {
								color: '#acdaff'    // x轴颜色
							}
						},
                        data: sevenDays
                    },
                    yAxis: {
                        type : 'value',  
                        show: true,
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false,
						},
						axisLine: {
							lineStyle: {
								color: '#acdaff'    // y轴颜色
							}
						}
                    },
                    series: [{
                        name: textName,
                        type: 'line',
                        itemStyle : {  
                                normal : {  
                                    color:'#29a5fe',
                                    lineStyle:{  
                                        color:'#29a5fe'  
                                    }
                                }  
                            },  
                        data: seriesData
                    }]
            });
        }
    }


    // 选择操作:对比/趋势图/详情
    onClickSelct = (obj,item) => {
        // 趋势图
        if (item.key == 1) {
            this.showGoodsEchartModal(obj.pid)
        }
        else if(item.key == 0) {
            this.showGoodsContrastTable(obj.pid,obj.sku);
        }
        else if(item.key == 2) {
            hashHistory.push('/detail/'+obj.sku);
        }
    }

    // 显示主体商品趋势图
    showGoodsEchartModal = (pid) => {

        // 显示弹框
        this.setState({
            goodsEchartVisible: true,
            goodsEchartPid: pid
        });

        // 参数
        let args = {
            pid:pid,
            startTime: DateTime.getDateOfDays(30),
            endTime:DateTime.getDateOfDays(1)
        }

        // 请求数据
        this.props.getGoodsEcharData(args); 
        
    }
    // 隐藏主体商品趋势图
    hideGoodsEchartModal = () => {
        this.setState({
            goodsEchartVisible: false 
        })
    }

    // 载入主体商品Echart图
    loadEchart = (data) => {
        
        if (this.refs.echartId) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(this.refs.echartId);

            let yName;
            switch(data.name){
                case '价格':
                    yName = '美元';
                    break;
                case '销量':
                    yName = '件';
                    break;
                case '评分':
                    yName = '';
                    break;
                case '评论':
                    yName = '条';
                    break;
                case '问答':
                    yName = '条';
                    break;
                case '关注':
                    yName = '个';
                    break;
                
            }

            // 绘制图表
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params,ticket,callback){
                        return '<div><p>'+params[0].name +"</p><p>"+ params[0].value+' '+yName+'</p></div>';
                    }
                },
                grid: {
                    top:'3%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.props.goodsEchartData.xAxisData,
                },
                yAxis: {
                    type: 'value',
                },
                series:[{
                    name:data.name,
                    type:data.type,
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                        },
                    },
                    areaStyle: { normal: {} },  
                    data:data.data
                }],
            });
        }   
    }

    // 选择控件日期，获取趋势图数据
    getGoodsEcharData = (date, dateString) => {
        // 参数
        let args = {
            pid:this.state.goodsEchartPid,
            startTime:dateString[0],
            endTime:dateString[1]
        }
        
        this.setState({
            defaultStartDate:dateString[0],
            defaultEndDate:dateString[1]
        })

        // 请求数据
        this.props.getGoodsEcharData(args);
        
        this.loadEchart(this.props.goodsEchartData.seriesData[this.state.goodsEchartRadioValue]); 
    }

    // 主图切换选项 
    onChangeEchartItem = (e) => {
        let val = e.target.value;

        this.setState({
            goodsEchartRadioValue: val,
        });

        this.loadEchart(this.props.goodsEchartData.seriesData[val])
    }


    // 最近N天
    onLatelyDate = (dayCount) => {
        
        const currentDate = DateTime.getDateOfDays(1),         // 今天日期
               latelyDate = DateTime.getDateOfDays(dayCount);  // daycount 前的日期

        // 赋值给文本框
        this.setState({
            defaultStartDate:latelyDate,
            defaultEndDate:currentDate,
        })

        // 参数
        let args = {
            pid:this.state.goodsEchartPid,
            startTime:latelyDate,
            endTime:currentDate
        }

        // 请求数据
        this.props.getGoodsEcharData(args);
        
        this.loadEchart(this.props.goodsEchartData.seriesData[this.state.goodsEchartRadioValue]); 

    }

    // 限制日期控件只能选今天或今天前的日期
    disabledDate(current) {
      return current && current.valueOf() > Date.now();
    }

}

export default GoodsList;
