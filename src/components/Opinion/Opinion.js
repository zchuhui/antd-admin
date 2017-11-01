import React from 'react'
import { connect } from 'dva';
import { Icon, Modal, Button, Input, message} from 'antd'
import styles from './Opinion.less'
import headImg from "./opinion.png";

const { TextArea } = Input

class Opinion extends React.Component {

  render(){
    return (
      <Modal 
        className={styles.opinionWrap} 
        visible={this.props.opinionVisible} 
        onCancel={this.switchOpinion} 
        wrapClassName="vertical-center-modal"
        footer={
          [<Button 
            key="submit" 
            type="primary"
            onClick={this.handleSubmit} 
            loading={this.props.opinionLoading ? this.props.opinionLoading : null}
          >提交
          </Button>, 
          <Button onClick={this.switchOpinion}>取消</Button>
          ]}>
        <div>
          <div className={styles.headImg}>
            <img src={headImg} />
          </div>
          <b className={styles.title}>内容描述：</b>
          <TextArea rows={8} placeholder={"简单描述你的意见与需求 \n\n例子：\n我们组平时关注以下竞争对手，快帮我补上。\nwww.shein.com \nwww.zaful.com"} id="contentText" />
        </div>
        <div style={{ margin: "20px auto" }}>
          <b className={styles.title}>联系方式：</b>
          <Input placeholder="留下球球（QQ~），方便联系" id="contactText" />
        </div>
        <p>你也可以加我们的Q群, 直接跟我们说。 群号：681211866（情报源服务群）</p>
      </Modal>
    )
  }

  // 打开/关闭
  switchOpinion=()=>{
    this.props.dispatch({
        type: 'app/switchOpinion',
    })
  }

  // 提交
  handleSubmit=()=>{
    const content = document.getElementById('contentText').value;
    const contact = document.getElementById('contactText').value;
    if(content !== ""){
      this.props.dispatch({ 
        type: 'app/opinionMsg',
        payload:{'opinion_content':content,'contact_info':contact} 
      }) 
    }else{
      message.destroy();
      message.warn("随便写点东西也可以吧~~");
    }
    
  }

}


function mapStateToProps(state){
  return {...state.app};
}

export default connect(mapStateToProps)(Opinion)
