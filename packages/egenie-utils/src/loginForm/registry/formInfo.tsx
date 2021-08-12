import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Checkbox, Row, Col, Cascader, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Props } from '../interface';
import styles from './index.less';
import { protocol } from './protocol';

@inject('store')
@observer
export default class Index extends React.Component<Props> {
  componentDidMount(): void {
    const { queryBussinessType, systemType, getMarketList, getCity } = this.props.store;
    if (systemType.includes('ERP')) {
      queryBussinessType();
    }
    if (systemType === 'POS') {
      getMarketList();
      getCity();
    }
  }

  // 验证码
  public getCode = (): JSX.Element => {
    const { isSendCode, showImageCode, countDown } = this.props.store;
    return (

      // 此Id提供给图形验证码
      <Row id="registry">
        <Col span={13}>
          <Input placeholder="验证码"/>
        </Col>
        <Col span={10}>
          <Button
            className={styles.smscode}
            disabled={isSendCode}
            onClick={showImageCode.bind(this, 'registry', 134, -192)}
            type="primary"
          >
            {isSendCode ? `${countDown}S后重新获取` : '获取验证码'}
          </Button>
        </Col>
      </Row>
    );
  };

  public formList = (): JSX.Element[] => {
    const { systemType, registryFormData } = this.props.store;
    let result: JSX.Element[] = [];
    const formItemKeys = Object.keys(registryFormData);

    result = formItemKeys.map((keyName: string) => {
      const data = registryFormData[keyName];
      if (!(!data.systemType || data.systemType.includes(systemType))) {
        return null;
      }
      let itemEle = null;
      let label = '';
      let placeholder = '';
      let rules = data?.rules;
      if (data.differentLabel && typeof data.label === 'object') {
        label = data.label[systemType];
        placeholder = data.placeholder[systemType];
        rules = rules?.map((_item) => {
          return {
            ..._item,
            message: data.placeholder[systemType],
          };
        });
      } else {
        label = data.label;
        placeholder = data.placeholder;
      }
      if (data.type === 'select') {
        itemEle = (
          <Select>
            {data.options.map((item) => (
              <Select.Option
                key={item.value}
                value={item.value}
              >
                {item.name}
              </Select.Option>
            ))}
          </Select>
        );
      } else if (data.type === 'input') {
        itemEle = keyName === 'smsCode' ? this.getCode() : (
          data.prop === 'password'
            ? (
              <Input.Password
                autoComplete="new-password"
                placeholder={placeholder}
                visibilityToggle={false}
              />
            )
            : (
              <Input
                autoComplete="off"
                placeholder={placeholder}
                suffix={data.differentLabel && data.tooltip[systemType] ? (
                  <Tooltip title={data.tooltip[systemType]}>
                    <QuestionCircleOutlined
                      className={styles.suffix}
                      style={{ fontSize: 14 }}
                    />
                  </Tooltip>
                ) : undefined}
                type={data.prop}
              />
            )
        );
      } else if (data.type === 'cascader') {
        const { loadData, marketFloor } = this.props.store;
        itemEle = (
          <Cascader
            changeOnSelect
            loadData={loadData}
            options={marketFloor}
          />
        );
      }
      return (
        <Form.Item
          className={!data.required && 'norequired'}
          extra={data.help}
          key={keyName}
          label={label}
          name={keyName}
          required={data.required}
          rules={rules}
        >
          {itemEle}
        </Form.Item>
      );
    });
    return result;
  };

  render(): JSX.Element {
    const { systemType, registryformRef, handleFieldChange, registryDisabled, goBackChoice, handleRegistrySubmit } = this.props.store;
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={styles.formInfo}>
        <div className={styles.title}>
          填写
          {systemType}
          系统注册信息
        </div>
        <div className={styles.content}>
          <div className={styles.form}>
            <Form
              {...layout}
              colon={false}
              onFieldsChange={handleFieldChange}
              onFinish={handleRegistrySubmit}
              ref={registryformRef}
              validateTrigger={[
                'onBlur',
                'onChange',
              ]}
            >
              {this.formList()}
              <Form.Item
                className="norequired"
                label={' '}
                labelCol={{ span: 6 }}
                name="agreement"
                rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('需要同意协议'))) }]}
                valuePropName="checked"
                wrapperCol={{ span: 18 }}
              >
                <Checkbox>
                  <div className={styles.agreeProtocol}>
                    <span>
                      我同意
                    </span>
                    <span className={styles.protocolText}>
                      《e精灵 SaaS
                      {' '}
                      {systemType}
                      申请帐户协议》
                    </span>
                  </div>
                </Checkbox>
              </Form.Item>
              <Form.Item className={styles.operation}>
                <Button
                  className={styles.previousStep}
                  onClick={goBackChoice}
                  type="default"
                >
                  上一步
                </Button>

                <Button
                  className={styles.submit}
                  disabled={registryDisabled}

                  // type={registryDisabled ? 'default' : 'primary'}
                  htmlType="submit"
                  type="primary"
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.protocol}>
            <div className={styles.title}>
              e精灵 SaaS
              {' '}
              {systemType}
              申请帐户协议
            </div>
            <div className={styles.content}>
              {protocol(systemType)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
