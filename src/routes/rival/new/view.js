/**
 * 商品详情模块
 * Date: 2017/8/18
 * Author: zhuangchuhui
 */

import React from 'react';
import { connect } from 'dva';
import styles from './index.less'
import moment from 'moment';
import echarts from 'echarts';
import { Button, DatePicker, Spin, Select, Input, Table, Pagination, Popover, message, Cascader, Icon} from 'antd';
import { Link } from 'dva/router';
import DateTime from 'utils/time'; 
import Clipboard  from 'clipboard';

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option,
      InputGroup = Input.Group;
    
const clipboard  = new Clipboard('.copyUrl');


class NewView extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            site:'gearbest',                        // 站点
            cid:null,
            startDate: DateTime.getDateOfDays(7),   // 起始时间
            endDate: DateTime.getDateOfDays(1),     // 结束时间
            bid:null,                               // 品牌Id
            status:null,                            // 关联状态
            url:null,                               // 搜索url
            page:1,                                 // 页数

            bgSku:null,                             // 关联的bgSku

            relatedStatus:true,
            stockStatus:false,
        }
    }
    
    render() {

        // 数据表格式
        const columns = [
            { title: '商品', dataIndex: 'img_url', width:'10%',render:(text,record)=>(
                <div>
                    <p><img className={styles.productImg} src={record.img_url} /></p>
                    <Button 
                        type="primary" size="small" 
                        className='copyUrl' 
                        data-clipboard-text={record.product_url}
                        onClick={this.onCopyUrl.bind(this)}
                    >复制链接</Button>
                </div>)
            },
            { title: '竞争平台', dataIndex: 'site', width:'10%'},
            { title: '标题', dataIndex: 'pname', width:'15%',render:(text,record)=>(
                <div >
                    <p style={{maxWidth:300,textAlign:'left',marginBottom:5}}> {record.pname}</p>
                    <div>
                        <Popover 
                            title="关联" 
                            trigger="click" 
                            content={
                            <div>
                                <Input 
                                    placeholder="输入BG的SKU" 
                                    onChange={this.onChangeInputBgSku.bind(this)} 
                                    defaultValue={record.relate_sku !== "0"?record.relate_sku:null}
                                    style={{marginBottom:5,width:150}}
                                    /> &nbsp; 
                                <Button type="primary" onClick={this.onRelatedBGBySku.bind(this,record.sku)} loading={this.props.relatedLoading}>关联</Button>
                            </div>
                        }>
                            {
                                record.status == 1 ?
                                <span title="已关联" className={`${styles.relatedY} ${styles.fl}`} onClick={this.onShowRelated.bind(this,record.relate_sku)}></span>
                                :
                                <span title="未关联" className={`${styles.relatedN} ${styles.fl}`} onClick={this.onShowRelated.bind(this,record.relate_sku)}></span>
                            }
                        </Popover>
                        {/* <span className={styles.traceY}></span>
                        <span className={styles.traceN}></span> */}
                    </div>
                </div>
            )},
            { title: '价格', dataIndex: 'price', width:'10%',render:(text,record)=>(
                <div>
                    {
                        record.poa.length >0?
                        <Popover content={  
                            record.poa.map((item,index)=>
                            <p key={index}>
                                {item.name} :  ${ item.value }
                            </p>)
                        }
                        trigger="hover">
                        <span>$ {record.price}</span>
                    </Popover>
                    :<p>$ {record.price}</p>
                    }
                </div>
            )},
            { title: '上新时间', dataIndex: 'add_time', width:'10%',render:(text,record)=>(
                <div>
                    <p>{record.add_time.split(' ')[0]}</p>
                    <p>{record.add_time.split(' ')[1]}</p>
                </div>
            )},
            { title: '评论数', dataIndex: 'reviews', width:'5%'},
            { title: '关注数', dataIndex: 'favorites', width:'5%'},
            { title: '提问数', dataIndex: 'questions', width:'5%'},
            { title: '分类', dataIndex: 'cateName', width:'10%',
            render:(text,record) => (
                <div className={styles.cateName} title={record.cateName}>
                {
                    record.cateName?
                    record.cateName.split('>').map((item,index) => <p key={index}>{item}</p>)
                    :
                    record.cateName
                }
                </div>
            )
            },
            { title: '品牌', dataIndex: 'bname', width:'10%'},
            { title: '操作', width:'10%',render:(text,record) => (
                <div>
                    {
                        record.purInfo == null || record.purInfo.length == 0?
                        <Popover 
                            title="确认发起该产品的采购申请吗？" 
                            trigger="click" 
                            content={
                            <div style={{textAlign:'center'}}>
                                <Button type="primary" onClick={this.onStock.bind(this,record.pid)} loading={this.props.stockLoading}>确认</Button>
                            </div>
                        }>
                            <Button type="primary">采购</Button>
                        </Popover>
                        :
                        <Popover 
                            content={ record.purInfo.log} 
                            trigger="hover">
                            <div style={{textAlign:'center'}}>
                                <p>{ record.purInfo.adopt_status}</p>
                                <p>{ record.purInfo.purchase_status}</p>
                            </div>
                        </Popover>
                    }
                   {/*  <Button type="primary"><UndevelopedAlert text="采购"/></Button> */}
                    
                </div>
            )},
        ];
        
        // url输入框清空 icon
        const suffix = this.state.url ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null;

        return (
            <div className={`${styles.mainWrap} ${styles.rivalWrap}`}>

                <div className={`${styles.content} ${styles.rivalNewView}`}>
                    {/* 搜索栏 */}
                    <div className={styles.searchBar}>

                        <Cascader 
                            options={this.props.cate} 
                            defaultValue={[this.props.location.state.site,this.props.location.state.cid]}
                            placeholder="竞品平台-分类"
                            onChange = {this.onSelectSiteAndCid.bind(this)}
                            changeOnSelect 
                            allowClear
                            style={{ marginRight:10, width:300, marginBottom:10}}
                        />
                        <Select
                            showSearch
                            style={{ width: 120}}
                            className={styles.mr10}
                            placeholder="品牌"
                            optionFilterProp="children"
                            labelInValue  
                            allowClear  
                            onChange={this.onSelectBid.bind(this)}
                            >
                            {
                                this.props.brand?
                                this.props.brand.map((i,index) => <Option key={index} value={i.bid}>{i.bname}</Option>)
                                :null
                            }
                        </Select>
                        
                        <Select defaultValue="关联状态" onChange={this.onSelectStatus.bind(this)} className={styles.mr10}>
                            <Option value="0">全部</Option>
                            <Option value="1">已关联</Option>
                            <Option value="2">未关联</Option>
                        </Select>
                        {/* <Select defaultValue="追踪状态" className={styles.mr10}>
                            <Option value="0">全部</Option>
                            <Option value="1">已追踪</Option>
                            <Option value="2">未追踪</Option>
                        </Select> */}
                        <InputGroup compact style={{width:300,display:'inline-block',verticalAlign:'top'}}>
                            <Button style={{verticalAlign:'top'}}>上新时间</Button>
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
                        </InputGroup>
                        <Input placeholder="URL" 
                            style={{width:300}} 
                            className={styles.mr10} 
                            id="txtUrlId"  
                            value = {this.state.url}
                            onChange={this.onInputUrl.bind(this)} 
                            suffix={suffix}
                            ref={node => this.urlInput = node}
                        />
                        <Button type="primary" onClick={this.search.bind(this)}>搜索</Button>
                    </div>
                                
                    {/* 数据表 */}
                    <div className={styles.tableWrap}>
                        <Table
                            loading={ this.props.rivalViewLoading } 
                            columns={columns}
                            dataSource={this.props.rivalViewList !==null?this.props.rivalViewList.list:null}
                            pagination={false}
                        />
                        
                        <div className={styles.piginationWrap}>
                            {
                                this.props.rivalViewList !== null && this.props.rivalViewList.page !== undefined?
                                <Pagination
                                    className="ant-table-pagination"
                                    current={this.props.rivalViewList.page.page}
                                    pageSize={this.props.rivalViewList.page.pageSize}
                                    total={parseInt(this.props.rivalViewList.page.count)} 
                                    onChange={this.changePagination.bind(this)}
                                />
                                :null
                            }
                        </div>
                    </div>

                </div>
            </div>
        );
        
    }

    

    componentDidMount(){
        // 获取品牌菜单
        this.props.dispatch({ type: 'rival/getBrandList'}); 
        this.props.dispatch({ type: 'rival/getCateList'});

        const params = this.props.location.state;

        // 获取
        if(params){
            this.setState({
                site:params.site,
                cid:params.cid,
                startDate:params.startDate,
                endDate:params.endDate
            })

            // 首次搜索
            this.getRivalDataByParams({
                site:params.site,
                cid:params.cid,
                startDate:params.startDate,
                endDate:params.endDate
            })
        }
    }

    componentDidUpdate(){
        
        // 关联成功，刷新列表
        if(this.props.relatedStatus == 1 && this.state.relatedStatus){
            this.state.relatedStatus = false;

            this.timeout(2000).then((value) => {
                this.getRivalDataByParams({
                    site:this.state.site,
                    cid:this.state.cid,
                    url:this.state.url,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    page:this.state.page,
                })
            });
        }
        // 关联失败
        else if(this.props.relatedStatus == 2 ){
             this.timeout(2000).then((value) => {
                this.getRivalDataByParams({
                    site:this.state.site,
                    cid:this.state.cid,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    page:this.state.page,
                })
            });
        }
        
        
        // 采购成功，刷新列表
        if(this.props.stockStatus && !this.state.stockStatus){
            this.state.stockStatus = this.props.stockStatus;

            this.timeout(2000).then((value) => {
                this.getRivalDataByParams({
                    site:this.state.site,
                    cid:this.state.cid,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    page:this.state.page,
                })
            });

            this.state.stockStatus = false;
        }

    }


    
     /**
      * 选择站点与分类
      */
     onSelectSiteAndCid(value){
        
        var len = value.length;

        if (len == 1) {
            this.state.site = value[0];
            this.state.cid = null;
        }
        
        if (len > 1) {
            this.state.site = value[0];
            this.state.cid = value[len - 1];
        }

        if(len<1){
            this.state.site =null;
            this.state.cid = null;
        }

    }

    /**
     * 选择品牌
     * @param {number} value 
     */
    onSelectBid(value){
        if(value !== undefined){
            this.setState({
                bid:value.key,
            })
        }else{
            this.setState({
                bid:null
            })
        }
    }

    /**
     * 选择关联状态
     * @param {number} value 
     */
    onSelectStatus(value){
        this.setState({
            status:value,
        })
    }

    /**
     * url文本取值
     */
    onInputUrl(){
        const val = document.getElementById('txtUrlId').value;
        this.setState({
            url:val
        })
    }

    /**
     * 清空url文本
     */
    emitEmpty(){
        this.urlInput.focus();
        this.setState({ url: null });
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
    }

    /**
     * 限制日期控件只能选今天或今天前的日期
     * @param {*} current 
     */
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    /**
     * 复制产品url的提醒
     * @param {string} url 
     */
    onCopyUrl(url){
        message.destroy();
        message.warning("复制成功！");
    }

    /**
     * 搜索
     */
    search(){
        // 参数
        let params = {
            site:this.state.site,
            startDate:this.state.startDate,
            endDate:this.state.endDate,
            url:this.state.url,
            page:1,
        }

        // 判断参数是否已存在，存在则加上
        if(this.state.bid !== null){
            params.bid = this.state.bid;
        }
        if(this.state.status !== null){
            params.status = this.state.status;
        }
        if(this.state.url !== null){
            params.url = this.state.url;
        }
        if(this.state.cid !== null){
            params.cid = this.state.cid;
        }

        // 调用搜索函数
        this.getRivalDataByParams(params)
    }

    /**
     * 分页
     * @param {number} currentPage
     */
    changePagination(currentPage){
        // 存储当前分页到state
        this.setState({page:currentPage});

        // 获取参数
        let params = {
            site:this.state.site,
            startDate:this.state.startDate,
            endDate:this.state.endDate,
            page:currentPage
        }

        // 判断参数是否已存在，存在则加上
        if(this.state.bid !== null){
            params.bid = this.state.bid;
        }
        if(this.state.status !== null){
            params.status = this.state.status;
        }
        if(this.state.url !== null){
            params.url = this.state.url;
        }
        if(this.state.cid !== null){
            params.cid = this.state.cid;
        }

        // 调用搜索函数
        this.getRivalDataByParams(params);
    }

    /**
     * sku文本框赋值
     * @param {object} e 
     */
    onChangeInputBgSku(e) {
        // 把文本框的值存储到state
        this.setState({
            bgSku:e.target.value,
        })
    }

    /**
     * 展示弹框时，同步sku值
     */
    onShowRelated(relate_sku){
        relate_sku==null?
        this.setState({ bgSku:null })
        :
        this.setState({ bgSku:relate_sku })
    }

    /**
     * 关联商品
     * @param {string} sku 
     */
    onRelatedBGBySku(sku){
        if(this.state.bgSku == null || this.state.bgSku=='' || this.state.bgSku==0){
            message.destroy();
            message.warning("请先输入sku!");
        }else{
            // 开始关联
            this.setRelatedBgBySku({
                sku:sku,
                bgsku:this.state.bgSku
            });

            this.state.relatedStatus = true;
        }
    }

    /**
     * 采购
     * @param {string} pid 
     */
    onStock(pid){
        this.setStock({
            pid:pid
        });
    }

    /**
     * 异步定时器
     * @param {时间} ms 
     */
    timeout=(ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    }


    /**
     * 搜索
     * @param {object} params 
     */
    getRivalDataByParams(params){
        // 根据时间请求数据
        this.props.dispatch({
            type: 'rival/getRivalDataByParams',
            payload: params,
        })
    }

    /**
     * 关联
     * @param {object} params 
     */
    setRelatedBgBySku(params){
        this.props.dispatch({
            type: 'rival/setRelatedBgBySku',
            payload: params,
        })
    }

    /**
     * 采购
     * @param {object} params 
     */
    setStock(params){
        this.props.dispatch({
            type: 'rival/setStock',
            payload: params,
        })
    }



}


function mapStateToProps(state){
    return {...state.rival};
}

export default connect(mapStateToProps)(NewView)

