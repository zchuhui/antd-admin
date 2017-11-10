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
import { Button, DatePicker, Spin, Cascader, Input, InputNumber, Modal,message } from 'antd';
import DateTime from 'utils/time';

const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;

class Index extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            site: "gearbest",
            cid: null,
            level: null,
            priceMin: null,
            priceMax: null,
            visible:false,
            startDate: DateTime.getDateOfDays(7),
            endDate: DateTime.getDateOfDays(1),
            colour:0,
        }
    }

    render() {

        // 计算表格的宽度
        const COLWIDTH = this.props.data ? 100 / (this.props.data.date.length+1)+'%':0;

        return (
            <div className={`${styles.content}`}>
                <div>
                    <Cascader
                        className={styles.mb10}
                        options={this.props.cate ? this.props.cate : null}
                        defaultValue={this.props.location.state ? [this.props.location.state.site, this.props.location.state.cid] : ["gearbest", "54285", "54376"]}
                        placeholder="竞品平台-分类"
                        changeOnSelect
                        allowClear
                        style={{ marginRight: 10, width: 300 }}
                        onChange={this.onSelectSiteAndCid.bind(this)}
                    />
                    <InputGroup compact className={styles.mb10} style={{ width: 300, display: 'inline-block', verticalAlign: 'top' }}>
                        <Button style={{ verticalAlign: 'top',pointerEvents: 'none', backgroundColor: '#fff'}} >价格分区</Button>
                        <InputNumber min={0} value={this.state.priceMin} style={{ width: 90, }} placeholder="最小值" onChange={this.onChangePriceMin} onBlur={this.onBlur} />
                        <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                        <InputNumber min={0} value={this.state.priceMax} style={{ width: 90, borderLeft: 0 }} placeholder="最大值" onChange={this.onChangePriceMax} onBlur={this.onBlur} />
                    </InputGroup>
                    <InputGroup compact className={styles.mb10} style={{ width: 300, display: 'inline-block', verticalAlign: 'top' }}>
                        <Button style={{ verticalAlign: 'top', pointerEvents: 'none', backgroundColor: '#fff' }}>检索时间</Button>
                        <RangePicker
                            value={[
                                moment(this.state.startDate),
                                moment(this.state.endDate),
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
                    <Input placeholder="url" className={styles.mb10}  id='txtUrl' style={{ width: 150, marginRight: 10 }} />
                    <InputNumber min={10} max={50} className={styles.mb10} placeholder="热卖排序" id='txtHotSort' style={{ width: 150, marginRight: 10 }} />
                    <Button type="primary" onClick={this.onSearch} className={styles.mb10}>搜索</Button>
                </div>
                <div>
                    {
                        this.props.loading ? <div className={styles.dataNull}><Spin /></div> :
                            this.props.data ?
                            <div className={styles.dataTable}>
                                <ul>
                                    {/* 时间 */}
                                    <li className={styles.row}>
                                        <div
                                            key='00'
                                            className={`${styles.col} ${styles.rankCol} ${styles.index}`}
                                        >
                                            <p style={{ textAlign: 'right' }}>时间 &nbsp;</p>
                                            <p style={{ textAlign: 'left' }}> &nbsp; TOP</p>
                                        </div>
                                    {
                                        this.props.data.date.map((item,index)=>(
                                            <div 
                                                key={index} 
                                                className={styles.col} 
                                                style={{ width: COLWIDTH}}
                                            >
                                                {item}
                                            </div>
                                        ))
                                    }
                                    </li>
                                </ul>
                                <div className={styles.clear}>
                                    <div
                                        className={styles.row2}
                                        style={{ width: 80}}
                                    >
                                        {
                                            this.props.data.topSet.map((item, index) => (
                                                <div 
                                                    key={`item_rank${index}`} 
                                                    className={`${styles.col} ${styles.rankCol}`}
                                                    style={{ fontWeight: 'bold', color:'#108ee9',fontSize:14}}
                                                >
                                                    {item}
                                                </div>

                                            ))
                                        }
                                    </div>
                                    {
                                        /* 数据 */
                                        this.props.data.list.map((item,index)=>(
                                            <div className={styles.row2} key={`row_${index}`} 
                                                style={{ width: COLWIDTH}}>
                                                {
                                                    this.props.data.topSet.map((item2,index2)=>(
                                                        <div
                                                            key={`item2${index2}`}
                                                            className={styles.col} 
                                                        >
                                                            {
                                                                item.length > 0 && item[index2] ?
                                                                <span>
                                                                    <img src={item[index2].img_url} />
                                                                    {
                                                                       item[index2].colour!==0?
                                                                        <div 
                                                                            className={styles.dot} 
                                                                            style={{background:item[index2].colourValue}}
                                                                            onClick={this.onShowKin.bind(this, item[index2].colour)}
                                                                        ></div>
                                                                        :
                                                                        null 
                                                                    }
                                                                </span>
                                                                :<span></span> 
                                                            }
                                                            
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            ))
                                    }
                                </div>
                            </div>
                            :
                            <div className={styles.dataNull}>木有数据，重新搜索看看吧</div>
                    }
                </div>

                {/* 弹窗 */}
                <Modal
                    title={null}
                    onCancel={this.onHide}
                    visible={this.state.visible}
                    footer={null}
                    width={'60%'}
                >
                    <div>
                        {
                            this.props.data ?
                            this.formatModelData(COLWIDTH)
                            :null
                            /* this.props.data ? 
                            <div className={`${styles.dataTable} ${styles.modalDataTable}`}>
                                <ul>
                                    <li className={styles.row}>
                                        <div
                                            key='00'
                                            className={`${styles.col } ${styles.rankCol} ${styles.index}`}
                                            style={{ width: COLWIDTH }}
                                        >
                                            <p style={{ textAlign: 'right' }}>时间 &nbsp;</p>
                                            <p style={{ textAlign: 'left' }}> &nbsp; TOP</p>
                                        </div>
                                        {
                                            this.props.data.date.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.col}
                                                    style={{ width: COLWIDTH }}
                                                >
                                                    {item}
                                                </div>
                                            ))
                                        }
                                    </li>
                                </ul>
                                <div className={styles.clear}>
                                    <div
                                        className={styles.row2}
                                        style={{ width:COLWIDTH }}
                                    >
                                        {
                                            this.props.data.topSet.map((item, index) => (
                                                <div
                                                    key={`item_rank${index}`}
                                                    className={styles.col}
                                                    style={{ fontWeight: 'bold', color: '#108ee9', fontSize: 14 }}
                                                >
                                                    {item}
                                                </div>

                                            ))
                                        }
                                    </div>
                                    {
                                        this.props.data.list.map((item, index) => (
                                            <div className={styles.row2} key={`row_${index}`}
                                                style={{ width: COLWIDTH }}>
                                                {
                                                    this.props.data.topSet.map((item2, index2) => (
                                                        <div
                                                            key={`item2${index2}`}
                                                            className={styles.col}
                                                        >
                                                            {
                                                                item.length > 0 && item[index2] ?
                                                                    <span>
                                                                        {
                                                                            item[index2].colour !== 0 && item[index2].colour == this.state.colour?
                                                                                    <img src={item[index2].img_url} />
                                                                                    :null
                                                                        }
                                                                    </span>
                                                                    : null
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            :null */
                        }
                    </div>
                </Modal>
            </div>
        )
    }


    componentDidMount() {

        // 获取带过来的参数
        const params = this.props.location.state;
        if(params){
            this.props.dispatch({
                type:'rank/getHotProductSequence',
                payload:params,  
            })
        }else{
            this.props.dispatch({
                type: 'rank/getHotProductSequence',
                payload:{
                    site:this.state.site,
                }
            })
        }
        
    }
    componentDidUpdate() {
    }

    
    formatModelData = (COLWIDTH)=>{

        let topSet = this.props.data.topSet,
              list = this.props.data.list,
        thisColour = this.state.colour;
            
        // 筛选出有数据的行
        let markItem = [];
        list.map((item,index)=>{
            item.map((item2,index2)=>{
                if (item2.colour == thisColour){
                    markItem.push(index2);
                    return true;
                }
            })
        });

        return (
            <div className={`${styles.dataTable}`}>
                <ul>
                    <li className={styles.row}>
                        <div
                            key='00'
                            className={`${styles.col} ${styles.rankCol} ${styles.index}`}
                            style={{ width: COLWIDTH }}
                        >
                            <p style={{ textAlign: 'right' }}>时间 &nbsp;</p>
                            <p style={{ textAlign: 'left' }}> &nbsp; TOP</p>
                        </div>
                        {
                            this.props.data.date.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.col}
                                    style={{ width: COLWIDTH }}
                                >
                                    {item}
                                </div>
                            ))
                        }
                    </li>
                </ul>

                <div className={styles.clear}>
                    <div
                        className={styles.row2}
                        style={{ width: COLWIDTH }}
                    >
                        {
                            this.props.data.topSet.map((item, index) => (
                                /* 只显示有标记的数据 */
                                markItem.contains(index)?
                                <div
                                    key={`item_rank${index}`}
                                    className={styles.col}
                                    style={{ fontWeight: 'bold', color: '#108ee9', fontSize: 14 }}
                                >
                                    {item}
                                </div>
                                :null

                            ))
                        }
                    </div>
                    {
                        /* 数据 */
                        list.map((item, index) => (
                            <div className={styles.row2} key={`row_${index}`}
                                style={{ width: COLWIDTH }}>
                                {
                                    topSet.map((item2, index2) => (
                                        /* 只显示有标记的数据 */
                                        markItem.contains(index2)?
                                            <div
                                                key={`item2${index2}`}
                                                className={styles.col}
                                            >
                                                {
                                                    item.length > 0 && item[index2] ?
                                                        <span>
                                                            {
                                                                item[index2].colour !== 0 && item[index2].colour == this.state.colour ?
                                                                    <img src={item[index2].img_url} />
                                                                    : null
                                                            }
                                                        </span>
                                                        : null
                                                }
                                            </div>
                                            :null
                                        
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
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
        
        let startDate = dateString[0],
            endDate = dateString[1];

        // 获取两个时间差
        const days = this.getDateDiff(startDate,endDate,"day") +1;
        // 限制为十五天
        if(days > 15){
            endDate = moment(startDate).add(14, "days").format("YYYY-MM-DD");
            this.setState({ startDate: startDate, endDate: endDate });

            message.warning("超出搜索界限，请搜索15天之内数据O(∩_∩)O");
        }
        else{
            this.setState({ startDate: startDate, endDate: endDate });
        }
    }

    /**
     * 获取两个时间的时间差
     */
    getDateDiff=(startTime, endTime, diffType)=>{
        //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
        startTime = startTime.replace(/\-/g, "/");
        endTime = endTime.replace(/\-/g, "/");

        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime);      //开始时间
        var eTime = new Date(endTime);  //结束时间
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
            case "second":
                divNum = 1000;
                break;
            case "minute":
                divNum = 1000 * 60;
                break;
            case "hour":
                divNum = 1000 * 3600;
                break;
            case "day":
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
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
            this.state.level = len - 1;
        }
        if (len < 1) {
            this.state.site = null;
            this.state.cid = null;
            this.state.level = null;
        }
    }

    onSearch=()=>{

        const url = document.getElementById("txtUrl").value,
            rank = document.getElementById("txtHotSort").value,
            priceMin = this.state.priceMin,
            priceMax = this.state.priceMax;
        
        let params = {
            site: this.state.site ? this.state.site : null,
            cid: this.state.cid ? this.state.cid : null,
            level: this.state.level,
            sdate: this.state.startDate,
            edate: this.state.endDate
        }


        if (url !== "")
            params.url = url;
        if (rank !== "")
            params.rank = rank;
        if (priceMin !== null && priceMax !== null && priceMax>priceMin){
            params.sprice = priceMin;
            params.eprice = priceMax;
        }

        this.props.dispatch({
            type:'rank/getHotProductSequence',
            payload:params
        });
    }

    onChangePriceMin = (val) => {
        this.setState({
            priceMin:val
        })
    }

    onChangePriceMax = (val) => {
        this.setState({
            priceMax: val
        });
    }

    onBlur=()=>{
        const min = this.state.priceMin,
            max = this.state.priceMax;

        if(min && max && min > max){
            this.setState({
                priceMin:null,
                priceMax:null,
            })
            message.warning("最大值不能小于最小值");
        }
    }

    onHide = () => {
        this.setState({
            visible: false
        });
    }

    onShowKin = (colour) => {
        this.setState({
            visible: true,
            colour:colour,
        });
    }


}



function mapStateToProps(state) {
    return { ...state.rank };
}

export default connect(mapStateToProps)(Index)


/**
 * 数组操作：判断元素是否在素组里面
 */
Array.prototype.contains = function (val) {
    var len = this.length;
    while (len--) {
        if (this[len] === val) {
            return true;
        }
    }
    return false;
}