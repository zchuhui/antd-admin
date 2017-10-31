import React from 'react'
import { connect } from 'dva';
import { Icon, Modal, Button, Input, message} from 'antd'
import styles from './Opinion.less'

const { TextArea } = Input

class Opinion extends React.Component {

  render(){
    return(
        <Modal
          key="666"
          className = {styles.opinionWrap}
          visible={this.props.opinionVisible} 
          onCancel={this.switchOpinion}
          title="说出你的想法"
          footer={[
            <Button key="submit" type="primary"  onClick={this.handleSubmit} loading={this.props.opinionLoading?this.props.opinionLoading:null}>
              提交
            </Button>,
            <Button onClick={this.switchOpinion}>取消</Button>
          ]}
        >
        
          <div >
            <p style={{marginBottom:10}}>内容描述：</p>
            <TextArea rows={8} placeholder={'简单描述你的意见与需求 \n '} id='contentText'  />
          </div>
          <div  style={{margin:'20px auto'}}>
            <p style={{marginBottom:10}}>联系方式：</p>
            <Input placeholder="留下球球（QQ~），方便联系" id='contactText'/>
          </div>
          <p>你也可以加我们的Q群, 直接跟我们说。 群号：66666666（情报源服务群）</p>
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
