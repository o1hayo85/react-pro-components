import { Dropdown, Menu, Modal, Input, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface Opera {
  id: string;
  name: string;
  url?: string;
}

const defaultOperations: Opera[] = [
  {
    id: 'account',
    name: '店铺账户中心',
  },
  {
    id: 'password',
    name: '修改密码',
  },
  
];

@inject('layoutStore')
@observer
export class HeaderUserInfo extends React.Component<any> {
  public passwordFormRef = React.createRef<FormInstance>();

  public menu = () => {
    const { handleUserOpertion } = this.props.layoutStore;
    const list = [
      ...defaultOperations,
      ...this.props.userInfoRight,
      {
        id: 'exit',
        name: '退出登录',
        url: '/logout',
      },
    ];
    return (
      <Menu>
        {list.map((item) => (
          <Menu.Item
            key={item.id}
            onClick={(data) => handleUserOpertion(data, item)}
          >
            {item.url ? (
              <a href={item.url}>
                {item.name}
              </a>
            ) : item.name}

          </Menu.Item>
        ))}
      </Menu>
    );
  };

  public passwordModal = () => {
    const {
      togglePassword,
      handleChangePassword,
    } = this.props.layoutStore;
    return (
      <Modal
        maskClosable={false}
        onCancel={togglePassword.bind(this, false)}
        onOk={handleChangePassword.bind(this, this.passwordFormRef)}
        title="修改密码"
        visible
      >
        <Form
          ref={this.passwordFormRef}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true }]}
          >
            <Input type="password"/>
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              {
                required: true,
                min: 5,
                max: 50,
                message: '密码长度必须在5-50之间！',
              },
            ]}
          >
            <Input type="password"/>
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入密码不一致');
                },
              }),
            ]}
          >
            <Input type="password"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  render() {
    const { styles } = this.props;
    const {
      userInfo,
      showPassord,
    } = this.props.layoutStore;
    return (
      <div id={styles.headerUser}>
        {/* 扩展  */}
        {this.props.userInfoLeft}

        <Dropdown
          className={styles.name}
          overlay={this.menu()}
          placement="bottomLeft"
        >
          <span>
            {userInfo.name}
          </span>
        </Dropdown>
        <img src="https://front.runscm.com/egenie-common/images/avator.png"/>
        {showPassord && this.passwordModal()}
      </div>
    );
  }
}
