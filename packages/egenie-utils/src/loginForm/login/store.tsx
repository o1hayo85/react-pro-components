import type { FormInstance } from 'antd';
import { message } from 'antd';
import { action, observable } from 'mobx';
import qs from 'qs';
import React from 'react';
import { request } from '../../index';
import { api } from '../api';
import type { LoginParams, Response, LoginForm } from '../interface';

export class Store {
  @observable public username: string;

  @observable public password: string;

  @observable public smsCode: string;

  @observable public errorInfo: string;

  @observable public loginFormRef = React.createRef<FormInstance>();

  @observable public authimageneed = false;

  @observable public validateImage: number = new Date().getTime();

  @action public init = (): void => {
    this.authimageneed = false;
    this.errorInfo = '';
  };

  public changeAuthImage = action(() => {
    request({ url: api.getAuthImage }).then((res: Response) => {
      this.validateImage = new Date().getTime();
    });
  });

  public handleLogin = action((data: LoginForm) => {
    const params: LoginParams = {
      ...data,
      browserCode: localStorage.browserCode,
    };
    request({
      method: 'post',
      url: api.login,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: qs.stringify(params),
    }).then((res: Response) => {
      this.dealLoginResult(res, 'user', params);

      // window.location.href = '/egenie-erp-home/index';
      this.authimageneed = false;
      this.errorInfo = '';
    })
      .catch((res) => {
        message.destroy();
        this.handleLoginError(res.data, data);
      });
  });

  public handleLoginError = action((data: Response, params: LoginForm): void => {
    if (!data) {
      this.errorInfo = '网络错误,请联系管理员';
      return null;
    }
    this.errorInfo = data.data;
    if (data.status === 'AuthImageNeed') {
      this.changeAuthImage();
      this.authimageneed = true;
    } else if (data.status === 'send_again') {
      this.handleLogin(params);
    } else if (data.status === 'AccountRisk') {
      window.open(data.data);
    }
  });

  public dealLoginResult = (result: Response, type: string, info: LoginParams): void => {
    const index = result.data.indexOf('@@@');
    const urlStr = result.data.substring(0, index);
    const url = urlStr.indexOf('http://') === -1 && urlStr.indexOf('https://') === -1 ? (`http://${urlStr}`) : urlStr;
    const sessionId = result.data.substring(index + 3);
    const exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);

    // document.cookie = "JSESSIONID=" + sessionId + "; expires="+ exp.toGMTString() +"; path=/";
    // clearCookie('JSESSIONID')
    // setCookie('JSESSIONID', sessionId, 1)
    window.location.assign(`${url}?JSESSIONID=${sessionId}`);

    // window.location.assign('./userManage'+"?JSESSIONID="+sessionId);
  };

  //  表单验证
  public handleFieldsChange = action((changeFields, allFields) => {
    // 解决后端错误信息与前端表单错误重叠
    this.errorInfo = '';
    if (!changeFields.length) {
      return;
    }
    if (!changeFields[0].value) {
      this.errorInfo = '';
    }
  });
}
