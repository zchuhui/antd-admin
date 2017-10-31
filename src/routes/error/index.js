import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'

const Error = () => (<div className="content-inner">
  <div className={styles.error}>
    <Icon type="rocket" />
    <h3>拼命开发中...</h3>
  </div>
</div>)

export default Error
