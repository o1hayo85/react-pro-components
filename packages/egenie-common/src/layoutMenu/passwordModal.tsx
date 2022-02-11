import { Modal, Input, Form, message } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { request } from '../request';

@observer
export class PasswordModal extends React.Component<{ onClose: () => void; callback: () => void; }> {
  public passwordFormRef = React.createRef<FormInstance>();

  @action public handleChangePassword = async() => {
    const {
      onClose,
      callback,
    } = this.props;

    const {
      oldPassword,
      newPassword,
    } = await this.passwordFormRef.current.validateFields();

    await request({
      url: '/api/iac/user/changePassword',
      method: 'post',
      data: {
        oldPassword,
        newPassword,
      },
    });

    message.success('修改成功，请重新登录');
    onClose();
    setTimeout(callback, 2000);
  };

  render() {
    const {
      props: { onClose },
      handleChangePassword,
    } = this;
    return (
      <Modal
        maskClosable={false}
        onCancel={onClose}
        onOk={handleChangePassword}
        title="修改密码"
        visible
      >
        <Form
          labelCol={{ span: 6 }}
          ref={this.passwordFormRef}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: '请输入原始密码',
              },
            ]}
          >
            <Input
              placeholder="请输入原始密码"
              type="password"
            />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              {
                required: true,
                min: 5,
                max: 50,
                message: '请输入新密码,密码长度必须在5-50之间',
              },
            ]}
          >
            <Input
              placeholder="请输入新密码,密码长度必须在5-50之间"
              type="password"
            />
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
            <Input
              placeholder="请再次输入新密码"
              type="password"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
