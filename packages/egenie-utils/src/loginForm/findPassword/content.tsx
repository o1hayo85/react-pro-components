import { Steps, Form, Input, Button, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import type { Props } from '../interface';
import styles from './index.less';

@inject('store')
@observer
export default class Content extends React.Component<Props> {
  render(): JSX.Element {
    const { currentStep, findPasswordFormRef, handleFormVerify, errorInfo, handleFindPasswordFieldsChange, showImageCode, isSendCode, countDown, volidMobile, goBackPreviousStep } = this.props.store;
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.findPassword}>
        <div className={styles.title}>
          找回密码
        </div>
        <div className={styles.content}>
          <div className={styles.steps}>
            <Steps current={currentStep}>
              <Steps.Step title="验证账号"/>
              <Steps.Step title="验证手机号"/>
              <Steps.Step title="设置新密码"/>
            </Steps>
          </div>
          <div className={styles.form}>
            <Form
              {...layout}
              colon={false}
              onFieldsChange={handleFindPasswordFieldsChange}
              onFinish={handleFormVerify}
              ref={findPasswordFormRef}
            >
              {currentStep === 0 && (
                <Form.Item
                  label="账号"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: '请输入账号',
                    },
                  ]}
                >
                  <Input placeholder="请输入账号"/>
                </Form.Item>
              )}
              {currentStep === 1 && (
                <>
                  <Form.Item
                    label="手机号"
                  >
                    <span>
                      {volidMobile}
                    </span>
                  </Form.Item>
                  <Form.Item
                    extra="如手机号已没用或手机号不正确，请联系工作人员进行重置。"
                    label="验证码"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码',
                      },
                    ]}

                    wrapperCol={{ span: 26 }}
                  >
                    <Row id="findPassword">
                      <Col span={14}>
                        <Input placeholder="验证码"/>
                      </Col>
                      <Col span={10}>
                        <Button
                          className="smscode"
                          disabled={isSendCode}
                          onClick={showImageCode.bind(this, 'findPassword', 202, -188)}
                          type="primary"
                        >
                          {isSendCode ? `${countDown}S后重新获取` : '获取验证码'}
                        </Button>
                      </Col>
                    </Row>

                  </Form.Item>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <Form.Item
                    extra="密码需包括字母和数字，且长度不小于8位"
                    label="输入新密码"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码',
                      },
                      {
                        pattern: /^(?=.*\d+)(?=.*[a-zA-Z]+)[0-9a-zA-Z~!@#$^*_]{8,18}$/,
                        message: '密码格式不正确',
                      },
                    ]}
                  >
                    <Input
                      placeholder="请输入密码"
                      type="password"

                    />
                  </Form.Item>
                  <Form.Item
                    label="确认新密码"
                    name="newRepeatPassword"
                    rules={[
                      {
                        required: true,
                        message: '请再次输入密码',
                      },
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
                      placeholder="请再次输入密码"
                      type="password"

                    />
                  </Form.Item>
                </>
              )}
              <Form.Item>
                <div className={styles.error}>
                  {errorInfo}
                </div>
              </Form.Item>
              <Form.Item
                label="operation"
                wrapperCol={{ span: 24 }}
              >
                <div className="footerOperation">
                  {currentStep !== 0 && (
                    <Button
                      className="default"
                      onClick={goBackPreviousStep}
                    >
                      上一步
                    </Button>
                  )}
                  {currentStep !== 2 && (
                    <Button
                      className="primary"
                      htmlType="submit"
                      type="primary"
                    >
                      下一步
                    </Button>
                  )}
                  {currentStep === 2 && (
                    <Button
                      className="primary"
                      htmlType="submit"
                      type="primary"
                    >
                      提交
                    </Button>
                  )}
                </div>
              </Form.Item>
            </Form>
          </div>

        </div>
      </div>

    );
  }
}
