/**
 * 销售秘书-类目模块
 * Date: 2017-07-10
 * Autor:zhuangchuhui
 */

import React from 'react';
import { Link } from 'dva/router';
import styles from './sale-secy.less';
import { Icon, Spin, Radio, Select,Cascader} from 'antd';
import echarts from 'echarts';

const Option = Select.Option;
let setChartClickCount = 0; 

class Category extends React.Component {
    constructor() {
        super();
        
        this.state = {
            selectLabel:null,  // 选中的类目名称
            selectVal:null     // 选中的类目值
        }
	}

    render() {
        return (
            <div className={styles.panel}>
                <div className={styles.panelTitle}>
                    <span className={styles.fl}>类目情况</span>
                </div>
                
                <div className={styles.categoryWrap}>
                    {
                        this.props.myProductInCate !== null?
                        <ul className={styles.clear}>
                            <li>
                                <div ref='catePieChart' style={{width:'100%',height:550,}}></div>
                            </li>
                            <li>
                            {
                                this.props.loading?
                                <div className={styles.loadWrap} style={{minHeight:593}}>
                                    <Spin tip="加载中..." style={{ marginTop: '15%'}} />
                                </div>
                                :
                                <div>

                                    <h3>{this.state.selectLabel?this.state.selectLabel:this.props.cateSet ? this.props.cateSet[0].name :null} | 销量排行</h3>
                                    {
                                        this.props.myProductInCate?
                                        this.props.myProductInCate.map((item,index)=>
                                        <div className={styles.itemPanel}  key={`shops-${item.pid}`}>
                                            <div className={styles.imgWrap}> 
                                                {/* <a href={item.product_url} target="_blank"><img src={item.img_url}/></a> */}
                                                <Link to={"/detail/"+item.sku} target="_blank">
                                                    <img src={item.img_url}/>
                                                </Link>
                                            </div>
                                            <div className={styles.itemContent}>
                                                <div className={styles.itemTitle}>
                                                    <a href={item.product_url} target="_blank">{item.pname}</a>
                                                </div>
                                                <div className={styles.itemDetail}>
                                                    <span>{item.price} 美元</span>
                                                    <span className={styles.fr}>
                                                        {
                                                            //this.formatTrendNumber(item.no)
                                                        }
                                                    </span>
                                                    <b className={`${styles.fr} ${styles.exponentOrange}`}>{item.ins}件</b>
                                                </div>
                                            </div>
                                        </div> 
                                        ):null
                                    }
                                </div>
                            }
                            </li>
                        </ul>
                        :
                        <div className={styles.dataNullWrap}><Spin /></div>
                    }
                </div>

            </div>
        )
    } 

    
    componentDidMount(){
        
        // 延迟3秒加载Echart图表
        this.timeout(3000).then((value) => {
            if(this.props.cateSet){
                this.loadChart(this.formatDataToEchartPieData(this.props.cateSet));
            }
        });
        
    }


    /**
     * 切换类目，根据类目获取数据
     * @param {object} _this 
     */
    onChangeCategory(_this){
        let cid = _this.key,
          label = _this.label;
        
        this.setState({
            selectVal:cid,
            selectLabel:label,
        });

        this.props.getCategoryByCid(cid);
    }


    /**
     * 载入echart图表
     * @param {Array} cateSet [饼形图数据]
     * @param {Array} prices  [圆柱图数据]
     */
	loadChart(cateSet,prices){
        const catePieChartId = this.refs.catePieChart;
        if(cateSet.valueArray && catePieChartId){
            // 初始化Echart
            const catePieChart = echarts.init(catePieChartId);  

            const option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "销量占比：{d}% ({c}件)"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: false,
                },
                color:['#baebe1','#f8a942','#42a6f8','#ffe990','#ff7082'],
                legend: {
                    show:false,
                    orient: 'vertical',
                    right: '5%',
                    top:'10%',
                    data: cateSet.cidArray
                },
                series : [
                    {
                        name: '',
                        type: 'pie',
                        radius : '50%',
                        center: ['50%', '50%'],
                        data:cateSet.valueArray
                    }
                ]
            }

            // 绘制饼形图
            catePieChart.setOption(option);

            // 点击重新请求数据
            catePieChart.on('click',(param)=>{

                // Echart 传入点击事件 
                if(setChartClickCount == 0){
                    // 请求数据
                    this.props.getCategoryByCid(param.data.cid);

                    // 存储数据到state
                    this.state.selectVal = param.data.value;
                    this.state.selectLabel =param.data.name;
                } 
            });
        }
    }
    
    /**
     * 把数据转成EChart饼图数据
     * @param {*} runChart 
     */
	formatDataToEchartPieData(runChart) {
		let obj = {
            cidArray:[],
			labelArray:[],
            valueArray:[]
		}

		if(runChart && runChart.map){

            runChart.map((item,index)=>{
                let obj2 = {};
                for(let i in item){
                    // 存储名称
                    if(i == 'name'){
                        let nameItem = item[i].split('>');
                        let nameVal = nameItem[nameItem.length-1];
                        obj.labelArray.push(nameVal);
                        obj2.name = nameVal;
                    }
                    // 存储占比值
                    /* if(i == 'per'){
                        obj2.value = item[i].split('%')[0];
                    } */
                    // 存储 cid
                    if(i == 'cid'){
                        //obj.cidArray.push(item[i]);
                        obj2.cid = item[i];
                    }
                    if(i == 'num'){
                        obj2.value = item[i];
                    }
                }
                obj.valueArray.push(obj2);
            })
            
        }
		return obj;
    }
    
    /**
     * 把数据转成EChart数据
     * @param {*} runChart 
     */
    formatDataToEchartData(runChart) {
        let obj = {
            labelArray: [0],
            valueArray: [0]
        }

        if (runChart) {
            let arr1 = [];
            let arr2 = [];
            
            for (let i in runChart) {
                let dateLabel = i;
				arr1.push(dateLabel);
                arr2.push(runChart[i]);
            }

            obj.labelArray = arr1;
            obj.valueArray = arr2;
        }
        return obj;

    }
    
    /**
     * 格式化热度的显示格式
     * @param {*} no 
     */
    formatTrendNumber(no){
        //if(no){
            if(no == 'hot'){
                return (<span className={styles.exponentDown}>{no}</span>)
            }
            else if(no > 0){
                return (<span className={styles.exponentTop}><Icon type="arrow-up" />{no}</span>)
            }
            else if(no < 0){
                return (<span className={styles.exponentDown}><Icon type="arrow-down" />{no}</span>)
            }
            else if(no == 0){
                return (<span className={styles.exponentZero}>{no}</span>)
            }
        //}
    }

    /**
     * 异步定时器
     */
    timeout = (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    }

}

export default Category;