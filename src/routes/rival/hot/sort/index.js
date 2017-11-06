/**
 * 品类模块
 * Date: 2017/11/03
 * Author: zhuangchuhui
 */

import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import moment from 'moment';
import echarts from 'echarts';
import { Button, DatePicker, Spin, Cascader, Input,} from 'antd';
import DateTime from 'utils/time';

const InputGroup = Input.Group;


class Index extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            site: null,    
            cid: null,
            date: DateTime.getDateOfDays(1),  
        }
    }

    render() {
        return (
            <div className={`${styles.content}`}>
                <div>
                    <Cascader
                        options={this.props.cate ? this.props.cate:null} 
                        placeholder="竞品平台-分类"
                        changeOnSelect
                        allowClear
                        style={{ marginRight: 10, width: 300}}
                        onChange={this.onSelectSiteAndCid.bind(this)}
                    />
                    <InputGroup compact style={{ width: 236, display: 'inline-block', verticalAlign: 'top' }}>
                        <Button style={{ verticalAlign: 'top' }}>检索时间</Button>
                        <DatePicker 
                            defaultValue={moment(this.state.date)}
                            disabledDate={this.disabledDate}
                            onChange={this.onGetDateRange.bind(this)} />
                    </InputGroup>
                    <Button type="primary" onClick={this.onSearch}>搜索</Button>
                </div>
                <div className={styles.chartWrap}>
                {
                    this.props.loading ? <div className={styles.dataNull}><Spin /></div> : 
                    this.props.data ?
                        <div>
                            <h2>{this.props.data.cateName}</h2>
                            <div ref="sortChartId" style={{ width: '100%', height: this.props.data.nums.length * 30 }}></div>
                            <div className={styles.chartName}>TOP100销售排序分类占比</div>
                        </div> 
                        : 
                        <div className={styles.dataNull}>该类目的热销商品排行暂无数据</div>
                }
                </div>

                <div className={styles.lineChartWrap}>
                {
                    this.props.cateLoading ? <div className={styles.dataNull}><Spin /></div> :
                    this.props.cateData?
                        <div>
                            <div ref="sortChartId2" style={{ width: '80%', height: 300, margin: '0 auto' }}></div>
                            <div className={styles.chartName}>{this.props.data ? this.props.data.cateName:null} 销量排序走势</div>
                        </div>
                        :
                         <div className={styles.dataNull}>该类目销量排序走势暂无数据</div>
                }
                </div>
                
            </div>
        )
    }


    componentDidMount() {
        this.props.dispatch({
            type:'sort/getHotProductsRateInCate',
            payload:{
                data:this.state.date,
            }
        })

        this.props.dispatch({
            type: 'sort/getCateChartInHotProducts',
            payload: {
                data: this.state.date,
            }
        })
    }

    componentDidUpdate() {
        if (this.props.data !== null && this.refs.sortChartId) {
            this.loadChartBar(this.props.data, this.refs.sortChartId);
        }
        if (this.props.cateData !== null && this.refs.sortChartId2) {
            this.loadChartLine(this.props.cateData, this.refs.sortChartId2);
        }
    }

    /**
     * 载入柱形图表
     * @param {object} chartData 
     */
    loadChartBar = (chartData, id) => {

        const chartBG = echarts.init(id);

        
        var seriesLabel = {
            normal: {
                show: true,
                formatter: function (params,index) {
                    let txt
                    if (params.data > 10){
                        txt =  params.data + "% (" + chartData.nums[params.dataIndex] + "件)" ;
                    }
                    else if (params.data < 5) {
                        txt = "";
                    }
                    else{
                        txt =  params.data + "%";
                    }
                    return txt;
                },
                fontSize: 14,
                color:'#fff'
            }
        }
        
        const option = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, index) {
                    return `${params[0].value}% (${chartData.nums[params[0].dataIndex]}件)`
                },
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
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        show: false,
                        textStyle: {
                            color: '#666'       // 字体颜色
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
                    type: 'category',
                    data: chartData.labels,
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
                    name: ``,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                            position: 'top'
                        },
                    },
                    data: chartData.values,
                    label: seriesLabel,
                },
            ]
        }

        chartBG.setOption(option);
    }

    /**
     * 载入线性图表
     * @param {object} chartData 
     */
    loadChartLine = (chartData, id) => {

        const chartBG = echarts.init(id);

        const option = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return "销售额：" + params[0].data
                    //return params[0].axisValueLabel + "<br/>" + params[0].data +"%"
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
                    data: chartData.labels,
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
                    name: '销量',
                    type: 'line',
                    stack: '销售额',
                    itemStyle: {
                        normal: {
                            color: '#acdaff',
                            show: true,
                        },
                    },
                    areaStyle: { normal: {} },
                    data: chartData.values
                },
            ]
        }

        chartBG.setOption(option);

    }


    /**
     * 限制日期控件只能选今天或今天前的日期
     * @param {*} current 
     */
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    /**
     * 日期控件操作
     * @param {*} date 
     * @param {*} dateString 
     */
    onGetDateRange(date, dateString) { 
        this.setState({'date':dateString});
    }

    // 搜索
    onSearch=()=>{
        this.props.dispatch({
            type:'sort/getHotProductsRateInCate',
            payload:{
                'date':this.state.date,
                'site':this.state.site,
                'cid':this.state.cid
            }
        })

        this.props.dispatch({
            type: 'sort/getCateChartInHotProducts',
            payload: {
                'date': this.state.date,
                'site': this.state.site,
                'cid': this.state.cid
            }
        })

    }

    /**
     * 选择站点与分类
     */
    onSelectSiteAndCid(value) {
        var len = value.length;
        if (len == 1) {
            this.state.site = value[0];
            this.state.cid = null;
        }
        if (len > 1) {
            this.state.site = value[0];
            this.state.cid = value[len - 1];
        }
        if (len < 1) {
            this.state.site = null;
            this.state.cid = null;
        }
    }
}

function mapStateToProps(state) {
    return { ...state.sort };
}

export default connect(mapStateToProps)(Index)
