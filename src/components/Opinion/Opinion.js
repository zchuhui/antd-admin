import React from 'react'
import { connect } from 'dva';
import { Icon, Modal, Button, Input, message} from 'antd'
import styles from './Opinion.less'
import headImg from "./opinion.png";

const { TextArea } = Input

const placeholder =" 简单描述你的意见与需求 \n\n 例子：\n 我们组平时关注以下竞争对手，快帮我补上。 \n www.shein.com \n www.zaful.com";
const contactPlaceholder = "留下球球（QQ~），方便联系";

class Opinion extends React.Component {
  render() {
    return (
      <Modal
        className={styles.opinionWrap}
        visible={this.props.opinionVisible}
        onCancel={this.switchOpinion}
        wrapClassName="vertical-center-modal"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
            loading={
              this.props.opinionLoading ? this.props.opinionLoading : null
            }
          >
            提交
          </Button>,
          <Button onClick={this.switchOpinion}>取消</Button>
        ]}
      >
        <div>
          <div className={styles.headImg}>
            <img src={headImg} />
          </div>
          <b className={styles.title}>内容描述：</b>
          <TextArea
            className={styles.textarea}
            rows={8}
            id="contentText"
            onFocus={this.textareaFoucs}
            onBlur={this.textareaBlur}
          />
        </div>
        <div style={{ margin: "20px auto" }}>
          <b className={styles.title}>联系方式：</b>
          <Input
            id="contactText"
            onFocus={this.inputFoucs}
            onBlur={this.inputBlur}
          />
        </div>
        <p>你也可以加我们的Q群, 直接跟我们说。 群号：<a href="https://jq.qq.com/?_wv=1027&k=5iHOXv5" target="_blank">681211866</a></p>
      </Modal>
    );
  }

  textareaFoucs = () => {
    let value = document.getElementById("contentText").value;
    if (placeholder === value) {
      document.getElementById("contentText").value = "";
      document.getElementById("contentText").style.color = "#666";
    }
  };

  textareaBlur = () => {
    if (document.getElementById("contentText").value === "") {
      document.getElementById("contentText").value = placeholder;
      document.getElementById("contentText").style.color = "#bbb";
    }
  };

  inputFoucs = () => {
    let value = document.getElementById("contactText").value;
    if (contactPlaceholder === value) {
      document.getElementById("contactText").value = "";
      document.getElementById("contactText").style.color = "#666";
    }
  };

  inputBlur = () => {
    if (document.getElementById("contactText").value === "") {
      document.getElementById("contactText").value = contactPlaceholder;
      document.getElementById("contactText").style.color = "#bbb";
    }
  };

  componentDidMount() {
    document.getElementById("contentText").value = placeholder;
    document.getElementById("contentText").style.color = "#bbb";
    document.getElementById("contactText").value = contactPlaceholder;
    document.getElementById("contactText").style.color = "#bbb";
  }

  // 打开/关闭
  switchOpinion = () => {
    this.props.dispatch({
      type: "app/switchOpinion"
    });
  };

  // 提交
  handleSubmit = () => {
    const content = document.getElementById("contentText").value;
    const contact = document.getElementById("contactText").value;

    if (content == "" || content == placeholder) {
      message.destroy();
      message.warn("随便写点东西也可以吧~~");
    } else {
      this.props.dispatch({
        type: "app/opinionMsg",
        payload: { opinion_content: content, contact_info: contact }
      });
    }
  };
}


function mapStateToProps(state){
  return {...state.app};
}

export default connect(mapStateToProps)(Opinion)
