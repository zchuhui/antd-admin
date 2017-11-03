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
import { Button, DatePicker, Spin, Cascader, Input } from 'antd';
import DateTime from 'utils/time';

const { RangePicker } = DatePicker,
    InputGroup = Input.Group;

class Index extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            startDate: DateTime.getDateOfDays(7),
            endDate: DateTime.getDateOfDays(1),
        }
    }

    render() {
        return (
            <div className={`${styles.content}`}>
                <div>
                    <Cascader
                        placeholder="竞品平台-分类"
                        changeOnSelect
                        allowClear
                        style={{ marginRight: 10, width: 300 }}
                    />
                    <InputGroup compact style={{ width: 300, display: 'inline-block', verticalAlign: 'top' }}>
                        <Button style={{ verticalAlign: 'top' }}>检索时间</Button>
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
                            style={{ width: 210 }}
                            allowClear={false}
                            disabledDate={this.disabledDate}
                            onChange={this.onGetDateRange.bind(this)}
                        />
                    </InputGroup>
                    <Input placeholder="步长" style={{width:120,marginRight:10,}}/>
                    <Button type="primary">搜索</Button>
                </div>
                <div className={styles.chartWrap}>
                    <h2>二级类目名称</h2>
                    <div ref="sortChartId" style={{ width: '100%', height: 600 }}>

                    </div>
                    <div className={styles.chartName}>TOP100销售分类占比</div>
                </div>
                <div></div>
            </div>
        )
    }


    componentDidMount() {
        let data = {
            label: ['价格区间1', '价格区间2', '价格区间3', '价格区间4', '价格区间5', '价格区间6', '价格区间4', '价格区间5', '价格区间6'],
            value: [22, 33, 1000, 222, 32, 333, 333, 222, 233, 23, , 333, 223],
        };
        this.loadChart(data, this.refs.sortChartId)
    }
    componentDidUpdate() {
    }

    /**
     * 载入折线图表
     * @param {object} chartData 
     */
    loadChart = (chartData, id) => {

        const chartBG = echarts.init(id);

        const option = {
            title: {
            },
            tooltip: {
                trigger: 'axis',
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
                    type: 'category',
                    data: chartData.label,
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
                    data: chartData.value,
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
        // 获取日期并赋值到state
        let startDate = dateString[0],
            endDate = dateString[1];

        // 赋值
        this.setState({ startDate: startDate, endDate: endDate });
    }
}

function mapStateToProps(state) {
    return { ...state.sort };
}

export default connect(mapStateToProps)(Index)
