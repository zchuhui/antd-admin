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
                    <Input placeholder="步长" style={{ width: 120, marginRight: 10, }} />
                    <Button type="primary">搜索</Button>
                </div>
                <div>
                    表格
                </div>
            </div>
        )
    }


    componentDidMount() {
    }
    componentDidUpdate() {
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
