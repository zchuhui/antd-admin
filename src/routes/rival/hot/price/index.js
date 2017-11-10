/**
 * 品类模块
 * Date: 2017/11/03
 * Author: zhuangchuhui
 */

import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import moment from 'moment';
import { Link } from 'dva/router';
import echarts from 'echarts';
import { Button, DatePicker, Spin, Cascader, Input, InputNumber, Tooltip } from 'antd';
import DateTime from 'utils/time';

const InputGroup = Input.Group;


class Index extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            site: 'gearbest', 
            cid: null,
            level: null,
            rank: 10,
            date: DateTime.getDateOfDays(1)
        }
    }
    
    render() {
        const PATHNAME = '/rival/hot/rank';

        return (
            <div className={`${styles.content}`}>
                <div>
                    <Cascader
                        options={this.props.cate ? this.props.cate : null}
                        placeholder="竞品平台-分类"
                        defaultValue={["gearbest", "54285", "54376"]}
                        changeOnSelect
                        allowClear
                        style={{ marginRight: 10, width: 300 }}
                        onChange={this.onSelectSiteAndCid.bind(this)}
                    />
                    <InputGroup compact style={{ width: 236, display: 'inline-block', verticalAlign: 'top' }}>
                        <Button style={{ verticalAlign: 'top' }}>检索时间</Button>
                        <DatePicker
                            defaultValue={moment(this.state.date)}
                            disabledDate={this.disabledDate}
                            onChange={this.onGetDateRange.bind(this)} />
                    </InputGroup>
                    <InputNumber placeholder="步数" id='txtStep' style={{width:150,marginRight:10}}/>
                    <Button type="primary" onClick={this.onSearch}>搜索</Button>
                </div>
                <div className={styles.chartWrap}>
                    {
                        this.props.loading ? <div className={styles.dataNull}><Spin /></div> :
                            this.props.data ?
                                <div>
                                    <h2>
                                        {this.props.data.cateName} &nbsp; 
                                        ({this.props.data.priceRange[0].split('-')[0]}~{this.props.data.priceRange[this.props.data.priceRange.length-1].split('-')[1]})
                                    </h2>
                                    <div>
                                        <ul className={styles.listBar}>
                                            {
                                                this.props.data.rate.map((item, index) => (
                                                    <li key={index}>
                                                        <div className={styles.listLabel}>{this.props.data.priceRange[index]}</div>
                                                        <div className={styles.listValue}>
                                                            <Link to={{
                                                                pathname: PATHNAME,
                                                                state: {
                                                                    site: this.state.site,
                                                                    cid: this.state.cid ? this.state.cid : item.cate3,
                                                                    level: this.state.level ? this.state.level : 3,
                                                                    rank: this.state.rank,
                                                                }
                                                            }}>
                                                            {
                                                                item.split('%')[0] > 5 ?
                                                                    <div className={styles.value} style={{ width: item }}>{item} ({this.props.data.num[index]}件)</div>
                                                                    :
                                                                    <Tooltip title={`${item}(${ this.props.data.num[index] }件)`}>
                                                                        <div className={styles.value} style={{ width: item }}></div>
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

                <div className={styles.chartName}>TOP100热卖排序价格分布</div>
            </div>
        )
    }

    componentDidMount(){
        this.props.dispatch({
            type: 'price/getHotProductsRateForPrice',
            payload: {
                data: this.state.date,
            }
        })
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
        this.setState({ 'date': dateString });
    }

    /**
     * 搜索
     */
    onSearch = () => {
        const step = document.getElementById('txtStep').value;
        this.props.dispatch({
            type: 'price/getHotProductsRateForPrice',
            payload: {
                'date': this.state.date,
                'site': this.state.site,
                'cid': this.state.cid,
                'step':step !==""?step:null,
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
    return { ...state.price };
}

export default connect(mapStateToProps)(Index)
