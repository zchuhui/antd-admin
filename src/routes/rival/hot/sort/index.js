/**
 * 品类模块
 * Date: 2017/11/03
 * Author: zhuangchuhui
 */

import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import { Link } from 'dva/router';
import moment from 'moment';
import echarts from 'echarts';
import { Button, DatePicker, Spin, Cascader, Input, Tooltip, Modal } from 'antd';
import DateTime from 'utils/time';

const InputGroup = Input.Group;


class Index extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            site: 'gearbest',    
            cid: null,
            level:null,
            rank:10,
            date: DateTime.getDateOfDays(1),  
            visible:false,
            cateName:null,
        }
    }

    render() {
        const PATHNAME = '/rival/hot/rank';
        
        return (
            <div className={`${styles.content}`}>
                <div>
                    <Cascader
                        options={this.props.cate ? this.props.cate:null} 
                        placeholder="竞品平台-分类"
                        defaultValue={["gearbest"]}
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
                            <div>
                                <ul className={styles.listBar}>
                                {
                                    this.props.data.child.map((item,index)=>(
                                        <li key={index}>
                                            <div className={styles.listLabel} 
                                                 onClick={this.onShowChart.bind(this, item.cate3,item.cname)

                                            }>{item.cname}</div>
                                            <div className={styles.listValue}>
                                                <Link to={{ 
                                                    pathname: PATHNAME,
                                                    state:{
                                                        site:this.state.site,
                                                        cid: this.state.cid ? this.state.cid : item.cate3,
                                                        level: this.state.level ? this.state.level:3,
                                                        rank:this.state.rank,
                                                    }
                                                    }}>
                                                {
                                                    item.rate.split('%')[0] > 5 ?
                                                        <div className={styles.value} style={{ width: item.rate }}>{item.rate} ({item.num}件)</div>
                                                        :
                                                        <Tooltip title={`${item.rate}(${item.num}件)`}>
                                                            <div className={styles.value} style={{ width: item.rate }}></div>
                                                        </Tooltip>
                                                        
                                                }
                                                </Link>
                                            </div>
                                        </li>
                                    ))
                                }
                                </ul>
                            </div>
                        </div> 
                        : 
                        <div className={styles.dataNull}>该类目的热销商品排行暂无数据</div>
                }
                </div>

                <div className={styles.chartName}>TOP100销售排序分类占比</div>

                <Modal
                    title={null}
                    onCancel={this.onHide}
                    visible={this.state.visible}
                    footer={null}
                    width={'60%'}
                >
                    <div>
                        <div className={styles.lineChartWrap}>
                            {
                                this.props.cateLoading ? <div className={styles.dataNull}><Spin /></div> :
                                    this.props.cateData ?
                                        <div>
                                            <div ref="sortChartId2" style={{ width: '100%', height:400}}></div>
                                            <div className={styles.chartName}>{this.state.cateName } 销量排序走势</div>
                                        </div>
                                        :
                                        <div className={styles.dataNull}>该类目销量排序走势暂无数据</div>
                            }
                        </div>
                    </div>
                </Modal>
                
            </div>
        )
    }



    componentWillMount() {
        this.props.dispatch({
            type: 'sort/getHotProductsRateInCate',
            payload: {
                data: this.state.date,
            }
        })
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.props.cateData !== null && this.refs.sortChartId2) {
            this.loadChartLine(this.props.cateData, this.refs.sortChartId2);
        }
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
     * 限制日期控件
     */
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    /**
     * 日期控件操作
     */
    onGetDateRange(date, dateString) { 
        this.setState({'date':dateString});
    }

    /**
     * 选择站点与分类
     */
    onSelectSiteAndCid(value) {

        var len = value.length;
        if (len == 1) {
            this.state.site = value[0];
            this.state.cid = null;
            this.state.level = null;
        }
        if (len > 1) {
            this.state.site = value[0];
            this.state.cid = value[len - 1];
            this.state.level = len-1;
        }
        if (len < 1) {
            this.state.site = null;
            this.state.cid = null;
            this.state.level = null;
        }
    }

    // 搜索
    onSearch = () => {
        this.props.dispatch({
            type: 'sort/getHotProductsRateInCate',
            payload: {
                'date': this.state.date,
                'site': this.state.site,
                'cid': this.state.cid
            }
        });

    }

    
    onShowChart = (cid,cateName) =>{
        this.setState({
            visible:!this.state.visible,
            cateName:cateName,
        });

        this.props.dispatch({
            type: 'sort/getCateChartInHotProducts',
            payload: {
                'date': this.state.date,
                'site': this.state.site,
                'cid': cid
            }
        })
    }

    onHide=()=>{
        this.setState({
            visible: false
        });
    }


}

function mapStateToProps(state) {
    return { ...state.sort };
}

export default connect(mapStateToProps)(Index)
