/**
 * BG搜索模块
 * Date: 2017/6/19
 * Author: zhuangchuhui
 */

import React from 'react';
import styles from './search-bar.less'
import moment from 'moment';
import { Menu, Dropdown, Button, Icon, DatePicker, Input, InputNumber, Select, Tag, Cascader } from 'antd';

const { MonthPicker, RangePicker } = DatePicker;
const SubMenu = Menu.SubMenu;
const InputGroup = Input.Group;
const Option = Select.Option;


// 默认抓取时间为一个月内
const firstDay = moment(new Date()).subtract(30,"days").format("YYYY-MM-DD");
const endDay  = moment(new Date()).subtract(1,"days").format("YYYY-MM-DD"); 


class Searcher extends React.Component {
    constructor(props, context) {
        super(props, context);

        // 搜索条件
        this.state = {
            status: '',

            // value
            args: {
                site: '',
                cid: '',
                bid: '',
                status: '',
                sku: '',
                price1: '',
                price2: '',
                startTime:firstDay,
                endTime:endDay,
                page: 1,
            },
            
            // label
            argsShow: {
                site: '',
                cid: '',
                bid: '',
                status: '',
                sku: '',
                price1: '',
                price2: '',
                startTime:'',
                endTime:'',
            },
        }
    }
    
    render() {
        return (
            <div className={ styles.searchWrap}>
                <div className={ styles.searchArgs }>
                    <span>筛选范围 <Icon type="right" className={styles.iconRight}/> </span>
                    <span id="tagList" ref='tagList'> 
                       { this.getObjectValToArray() }
                    </span>
                    
                </div>
                <div className={ styles.main }>
                
                    {/*搜索栏 start*/}
                    <div className={ styles.searchContent}>
                        <div className={ styles.searchLeft }>

                            {
                                this.props.cate?
                                <Cascader 
                                    options={ 
                                        this.props.cate[0].children?
                                        this.props.cate[0].children
                                        :this.props.cate
                                    } 
                                    placeholder="分类" 
                                    onChange={ this.handleCateMenu.bind(this) } 
                                    changeOnSelect 
                                    style={{ marginRight:10, width:300, marginBottom:10}}
                                />:null
                            }
                            
                            <Select
                                showSearch
                                style={{ width: 200, marginRight:10, verticalAlign:'top'}}
                                placeholder="品牌"
                                optionFilterProp="children"
                                onChange={ this.getBrand } 
                                labelInValue  
                                allowClear  
                                id='brandId'
                                >

                                {
                                    this.props.brand?
                                    this.props.brand.map((i,index) => <Option key={index} value={i.bid}>{i.bname}</Option>)
                                    :null
                                }
                            </Select>

                            <Select
                                style={{ width: 200, marginRight:10, verticalAlign:'top'}}
                                placeholder="关注状态" 
                                onChange={ this.getStatus }
                                >
                                <Option key="0">全部</Option>
                                <Option key="1">已关联</Option>
                                <Option key="2">未关联</Option>
                            </Select>

                            <InputGroup compact className={styles.dateGroup}>
                                <Input
                                    id="price1" 
                                    ref = "price1"
                                    style={{ width: 100, textAlign: 'center' }} 
                                    placeholder="价格区间"  />
                                <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none' }} placeholder="~" />
                                <Input
                                    id="price2" 
                                    ref = "price2"
                                    style={{ width: 100, textAlign: 'center', borderLeft: 0,marginRight:10 }} 
                                    placeholder="价格区间" 
                                />
                            </InputGroup>
                                
                            <Input id="sku" style={{ width: 180, verticalAlign:'top'}} placeholder="SKU / PID" />
                            
                            <div className={ styles.pickerDate }  >
                                <RangePicker 
                                    defaultValue={[
                                        moment(new Date()).subtract(30,"days"),
                                        moment(new Date()).subtract(1,"days"),
                                    ]} 
                                    ranges={{ 
                                        '今天': [moment(), moment()],
                                        '本周': [moment(), moment().endOf('week')], 
                                        '本月': [moment(), moment().endOf('month')] 
                                    }} 
                                    format="YYYY-MM-DD" 
                                    style={{ width:210 }}
                                    onChange={ this.getTime }
                                    allowClear={false}
                                />
                            </div>
                        </div>
                        <div className={ styles.searchRight }>
                            <Button type="primary" 
                                style={{ width: 150,marginBottom: 10 }} 
                                onClick={ this.handlerSearchClick.bind(this) }>搜索</Button>
                                
                        </div>
                        
                    </div>
                    {/*搜索栏 end*/}

                </div>

            </div>
        )
    }

    componentDidMount(){
        // 先搜索一次，为返回的菜单准备
        this.props.handleSearchArgs(this.state.args);
    }

    /**
     * 搜索
     */
    handlerSearchClick = (e) => {
        e.preventDefault();

        // 搜索条件赋值
        const price1 = document.getElementById('price1').value,
            price2 = document.getElementById('price2').value,
            sku = document.getElementById('sku').value;

        this.state.args.price1 = price1;
        this.state.args.price2 = price2;
        this.state.args.sku = sku;

        this.state.argsShow.price1 = price1;
        this.state.argsShow.price2 = price2;
        this.state.argsShow.sku = sku;

        this.state.args.page = 1;


        // 开始搜索
        this.props.handleSearchArgs(this.state.args);

    }


    // 选择分类
    handleCateMenu = (value, selectedOptions) => {

        var len = value.length;

        if (len == 1) {
            //this.state.args.site = value[0];
            //this.state.argsShow.site = value[0];
            this.state.args.cid = value[0];
            this.state.argsShow.cid = selectedOptions[0].label;

        }
        if (len > 1) {
            //this.state.args.site = value[0];
            this.state.args.cid = value[len - 1];
            this.state.argsShow.cid = selectedOptions[len - 1].label;
        }

        if(len<1){
            this.state.args.cid ='';
            this.state.argsShow.cid ='';
        }

    }


    /**
     * 生成标签
     * @return {[array]} [标签]
     */
    getObjectValToArray = () => {

        const objectArgs = this.state.argsShow;
        let str = [];

        for (let i in objectArgs) {
            if (objectArgs[i] !== "" && i !== "page") {
                let tag = this.tagString(i);
                let tagObj = {
                    type: i,
                    label: tag,
                    value: objectArgs[i]
                }
                str.push(tagObj);
            }
        }

        return(
            <span>
                {
                    str?
                    str.map((item,index) => 
                        <span 
                            key ={`label-${index}`}
                            className={ styles.tag } 
                            onClick={this.closeTag.bind(this,item)}
                            >
                            { item.label } : { item.value } 
                            <Icon type="close" style={{marginLeft:5}} />
                        </span>

                    )
                    :null
                }
            </span>
        )
    }


    /**
     * 搜索参数显示名称替换
     * @param  {[type]} tag [id]
     * @return {[string]}     [显示名称]
     */
    tagString = (tag) => {

        let tagString = "";

        switch (tag) {
            case "site":
                tagString = "站点";
                break;
            case "cid":
                tagString = "分类";
                break
            case "bid":
                tagString = "品牌";
                break
            case "status":
                tagString = "关联状态";
                break
            case "price1":
                tagString = "价格区间1";
                break
            case "price2":
                tagString = "价格区间2";
                break
            case "sku":
                tagString = "SKU";
                break
        }
        return tagString;
    }

    /**
     * 获取关联状态
     */
    getStatus = (value) => {

        this.state.args.status = value;
        
        if (value == 1) {
            this.state.argsShow.status = "已关联";
        } else if(value == 2){
            this.state.argsShow.status = "未关联";
        }else{
            this.state.argsShow.status = "全部";
        }
    }

    /**
     * 获取品牌
     */
    getBrand = (value) => {
        if(value){
            this.state.args.bid = value.key;
            this.state.argsShow.bid = value.label;
        }
        else{
            this.state.args.bid = '';
            this.state.argsShow.bid = '';
        }
    }

    /**
     * 关闭标签,并重新搜索
     * @param  {type} item [标签信息]
     */
    closeTag = (item) => {

        switch(item.type){
            case 'sku':
                this.state.args.sku = '';
                this.state.argsShow.sku = '';
                document.getElementById('sku').value = '';
                break;
            case 'price1':
                this.state.args.price1 = '';
                this.state.argsShow.price1 = '';
                this.state.args.price2 = '';
                this.state.argsShow.price2 = '';
                document.getElementById('price1').value = '';
                document.getElementById('price2').value = '';
                break;
            case 'price2':
                this.state.args.price1 = '';
                this.state.argsShow.price1 = '';
                this.state.args.price2 = '';
                this.state.argsShow.price2 = '';
                document.getElementById('price1').value = '';
                document.getElementById('price2').value = '';
                break;
            case 'site':
                this.state.args.site = '';
                this.state.argsShow.site = '';
                break;
            case 'cid':
                this.state.args.cid = '';
                this.state.argsShow.cid = ''; 
                break;
            case 'bid':
                this.state.args.bid = '';
                this.state.argsShow.bid = '';
                break;
            case 'status':
                this.state.args.status = '';
                this.state.argsShow.status = '';
                break;
        }

        
        this.setState({status:1});

        // 开始搜索
        this.props.handleSearchArgs(this.state.args); 
    }

    // 根据时间搜索
    getTime = (date, dateString) => {

        if(dateString[0]){
            this.state.args.startTime = dateString[0];
            this.state.args.endTime = dateString[1];

            this.props.handleSearchArgs(this.state.args);
        }
    }

}


export default Searcher;
