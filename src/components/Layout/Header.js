import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Modal, Button, Input, Dropdown,Tooltip  } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu
const { TextArea } = Input

const Header = ({ user, logout,opinionMsg, switchSider, siderFold, isNavbar, opinionVisible,
    menuPopoverVisible, location, switchMenuPopover,switchOpinion, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => e.key === 'logout' && logout() 

  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  return (
    <div className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div
          className={styles.button}
          onClick={switchSider}
        >
          <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
        </div>}
      <div className={styles.rightWarpper}>
        <Menu mode="horizontal" onClick={handleClickMenu}>
            <SubMenu
              style={{
                float: 'right',
              }}
              title={<span>banggood <Icon type="down" /></span>}
            >
              <Menu.Item key="1" disabled>
                Yoins
              </Menu.Item>
              <Menu.Item key="2" disabled>
                Newchic
              </Menu.Item>
            </SubMenu>
          </Menu>
        <Tooltip title="意见反馈">    
          <div className={styles.button} onClick={switchOpinion}><Icon type="edit"/></div>
        </Tooltip>

        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span>
              <Icon type="user" />
              {user.username}
            </span>}
          >
            <Menu.Item key="logout">
              Sign out
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
      
    </div>
  )
}
  

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
