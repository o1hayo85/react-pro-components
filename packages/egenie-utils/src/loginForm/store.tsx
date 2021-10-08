import type { FormInstance } from 'antd';
import { message } from 'antd';
import { history } from 'egenie-common';
import * as _ from 'lodash';
import { action, observable } from 'mobx';
import React from 'react';
import { request, SlideVerify, passwordReg, phoneReg, emailReg } from '../index';
import { api } from './api';
import type { Response, Market, FindPasswordForm, SelectOption } from './interface';

export class Store {
  constructor(options) {
    this.loginPath = options.route?.loginPath;
    this.logoImg = options.route?.logoImg;
    this.logoText = options.route?.logoText;
    console.log('options.....', options.route);
  }

  public loginPath: string;

  public logoImg: string;

  public logoText: string;

  /*
  *注册
  */
  @observable public registryFormData = {

    businessType: {
      label: '经营范围',
      required: true,
      rules: [
        {
          required: true,
          message: '请选择经营范围',
        },
      ],
      type: 'select',
      placeholder: '请选择经营范围',
      options: [],
      systemType: [
        'ERP',
        'SIMPLEERP',
      ],
    },
    name: {
      label: '公司名称',
      required: true,
      systemType: [
        'ERP',
        'SIMPLEERP',
      ],
      rules: [
        {
          required: true,
          message: '请输入公司名称',
        },
      ],
      type: 'input',
      placeholder: '请输入公司名称',

    },
    easyName: {
      label: {
        ERP: '档口拿货简称',
        SIMPLEERP: '公司简称',
      },
      tooltip: { ERP: '请填写在档口拿货时拿货条码上使用的名称，如果没有请填写店铺简称。' },
      required: true,
      differentLabel: true,
      systemType: [
        'ERP',
        'SIMPLEERP',
      ],
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
      type: 'input',
      placeholder: {
        ERP: '请输入档口拿货条码上使用的名称/店铺简称',
        SIMPLEERP: '请输入公司简称',
      },

    },
    marketFloor: {
      label: '市场楼层',
      required: true,
      systemType: 'POS',
      rules: [
        {
          required: true,
          message: '请选择市场楼层',
        },
      ],
      type: 'cascader',
      placeholder: '请选择市场楼层',
      options: [],
    },
    shopNo: {
      label: '档口号',
      required: true,
      systemType: 'POS',
      rules: [
        {
          required: true,
          message: '请输入档口号',
        },
        {
          validateTrigger: 'onBlur',
          validator(_, value) {
            return request({ url: `${api.queryRepeatShop}?shopNo=${value}` }).then((res: { data: boolean; }) => {
              if (res.data) {
                return Promise.reject('档口号已经存在');
              }
              return Promise.resolve();
            });
          },
        },
      ],
      type: 'input',
      placeholder: '请输入档口号',
    },
    mainCategoryId: {
      label: '主营类目',
      required: true,
      systemType: 'POS',
      rules: [
        {
          required: true,
          message: '请选择主营类目',
        },
      ],
      type: 'select',
      placeholder: '请选择主营类目',
      options: [],
    },
    shopSign: {
      label: '店招',
      systemType: 'POS',
      type: 'input',
      placeholder: '请输入门店招牌',
    },

    contact: {
      label: '联系人',
      required: true,
      rules: [
        {
          required: true,
          message: '请输入联系人姓名',
        },

      ],
      type: 'input',
      placeholder: '请输入联系人姓名',

    },
    mobile: {
      label: '账号',
      required: true,
      rules: [
        {
          required: true,
          pattern: phoneReg,
          message: '请输入正确手机号(11位)',
          trigger: ['onChange'],
        },
        {
          validateTrigger: 'onBlur',
          validator(_, value) {
            if (!phoneReg.test(value)) {
              return Promise.resolve('请输入正确手机号(11位)');
            }
            return request({ url: `${api.userCheck}?username=${value}` }).then((res) => {
              return Promise.resolve();
            })
              .catch((res) => {
                return Promise.reject(res?.data?.data || '账号已经存在');
              });
          },
        },
      ],
      type: 'input',
      placeholder: '请输入手机号码',

    },
    password: {
      label: '密码',
      required: true,
      rules: [
        {
          required: true,
          message: '请输入密码',
        },
        {
          pattern: passwordReg,
          message: '密码格式不正确',
        },
      ],
      type: 'input',
      prop: 'password',
      placeholder: '请输入密码',
      help: '密码需包括字母和数字，且长度不小于8位',
    },
    repeatPassword: {
      label: '确认密码',
      required: true,
      rules: [
        {
          required: true,
          message: '请再次输入密码',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject('两次输入密码不一致');
          },
        }),
      ],
      type: 'input',
      prop: 'password',
      placeholder: '请再次输入密码',

    },

    smsCode: {
      label: '验证码',
      required: true,
      rules: [
        {
          required: true,
          message: '请输入验证码',
        },
      ],
      type: 'input',
      placeholder: '请输入验证码',

    },
    email: {
      label: '邮箱地址',
      rules: [
        {
          required: false,
          message: '请输入邮箱地址',
        },
        {
          patter: emailReg,
          message: '邮箱格式错误',
        },
      ],
      type: 'input',
      placeholder: '请输入邮箱地址',

    },
  };

  @observable public countDown = 60;

  @observable public timer;

  @observable public systemType = 'POS'; // null, ERP,POS

  @observable public stepType = 0; // 0-选择系统, 1-注册, 2-注册成功

  @observable public registryDisabled = true;

  @observable public registryformRef = React.createRef<FormInstance>();

  @observable public marketData: Market[] = [];

  @observable public marketFloor: SelectOption[] = [];

  public goToLogin = action(() => {
    this.stepType = 0;
    this.systemType = null;
    this.registryDisabled = true;
    this.isSendCode = false;
    this.countDown = 60;
    history.push(this.loginPath);
  });

  // 获取经营范围
  public queryBussinessType = action(() => {
    request({ url: `${api.getDict}/business_type` }).then((res: Response) => {
      const options = res.data.map((item) => {
        return {
          value: item.key,
          name: item.val,
        };
      });
      this.registryFormData.businessType.options = options;
    });
  });

  // 处理市场楼层数据
  @action public loadData = (selectedOptions: SelectOption[]): void => {
    const { length } = selectedOptions;
    if (length === 1) {
      // 一级联动
      const targetOption = selectedOptions[0];
      targetOption.loading = true;
      request({
        method: 'post',
        url: api.findByCityIds,
        data: [targetOption.value],
      }).then((res: { data?; }) => {
        if (!res) {
          targetOption.loading = false;
          return;
        }
        const childData = res.data?.map((item) => ({
          ...item,
          label: item.marketName,
          value: item.id,
          isLeaf: false,
        }));
        Object.assign(targetOption, { children: childData.length ? childData : []});
        targetOption.loading = false;
        this.marketFloor = this.marketFloor.concat([]);
      });
    } else if (length === 2) {
      // 二级联动
      const targetOption = selectedOptions[1];
      targetOption.loading = true;
      request({ url: `${api.findFloor}?marketId=${targetOption.value}` }).then((res: { data?; }) => {
        const childData = res.data?.map((item) => ({
          ...item,
          label: item.floor,
          value: item.id,
          isLeaf: true,
        }));
        Object.assign(targetOption, { children: childData.length ? childData : []});
        targetOption.loading = false;
        this.marketFloor = this.marketFloor.concat([]);
      });
    }
  };

  // 获取城市
  @action public getCity = (): void => {
    request({ url: api.findMarketCity }).then((res: { data: SelectOption[]; }) => {
      this.marketFloor = res.data?.map((item) => ({
        label: item.cityName,
        value: item.cityId,
        isLeaf: false,
      }));
    });
  };

  // 获取主营分类
  public getMarketList = action(() => {
    request({ url: `${api.findOneLevel}?categoryType=25&parentCategoryId=0` }).then((res: Response) => {
      const options = res.data.map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      });
      this.registryFormData.mainCategoryId.options = options;
    });
  });

  // 检查档口号
  @action public handleCheckShopNo = (value: string) => {
    request({ url: `${api.queryRepeatShop}?shopId=${value}` }).then((res) => {
      return Promise.resolve();
    })
      .catch(() => {
        return Promise.reject('档口号已经存在');
      });
  };

  public goBackChoice = action(() => {
    this.stepType -= 1;
    this.registryDisabled = true;
    this.isSendCode = false;
    this.countDown = 60;
    this.volidMobile = null;
  });

  public handleLogin = action((data) => {
    request({
      method: 'post',
      url: api.login,
      data,
    }).then(() => {
      window.location.href = this.loginPath;
    })
      .catch((res) => {
        message.destroy();
      });
  });

  public changeSystemType = action((id: string) => {
    this.systemType = id;
    this.stepType += 1;
  });

  public handleFieldChange = action((changedFields, allFields) => {
    const emptyData = allFields.filter((item) => !item.value);
    if (changedFields[0].name[0] === 'mobile') {
      this.volidMobile = changedFields[0].value;
    }

    // 必填项全部不为空按钮才能点击
    const notRequiredFields = [
      'emial',
      'shopSign',
    ];
    this.registryDisabled = (emptyData.length > 3) || (emptyData.length === 3 && !notRequiredFields.includes(emptyData[0].name[0]));
  });

  public handleRegistrySubmit = action((data): void => {
    if (this.systemType === 'POS' && !data.marketFloor[2]) {
      message.error('市场楼层选择不完整，请选择到具体楼层');
      return;
    }
    const marketFloorData = this.systemType === 'POS' ? {
      marketId: data.marketFloor[1],
      floor: data.marketFloor[2],
    } : {};

    // 根据注册系统类型决定传参
    let tenantModule;
    switch (this.systemType) {
      case 'ERP':
        tenantModule = 100001;
        break;
      case 'POS':
        tenantModule = 100002;
        break;
      case 'SIMPLEERP':
        tenantModule = 100018;
        break;
    }
    console.log(tenantModule);
    request({
      url: api.register,
      method: 'post',
      data: {
        ...(_.omit(data, ['marketFloor'])),
        ...marketFloorData,
        tenantModule,
      },
    }).then(() => {
      this.stepType += 1;
    })
      .catch((res: Response) => {
        message.destroy();
        message.error(res.data ? res.data.data : '系统异常,请联系管理员');
      });
  });

  /*
  *找回密码
  */
  @observable public currentStep = 0; // 0-验证账号，1-验证手机号， 2-设置新密码

  @observable public findPasswordFormRef = React.createRef<FormInstance>();

  @observable public username: string;

  @observable public code: string;

  @observable public newPassword: string;

  @observable public newRepeatPassword: string;

  @observable public errorInfo = ''; // 后端返回的错误信息

  @observable public isSendCode = false;

  @observable public volidMobile: string;

  @observable public volidToken: string;

  // 回到上一步
  public goBackPreviousStep = action(() => {
    this.currentStep -= 1;
    this.errorInfo = '';
  });

  // 表单验证
  public handleFindPasswordFieldsChange = action((changeFields, allFields) => {
    // 解决后端错误信息与前端表单错误重叠
    this.errorInfo = '';
    if (!changeFields.length) {
      return;
    }
    if (!changeFields[0].value) {
      this.errorInfo = '';
    }
  });

  public handleFormVerify = action((data: FindPasswordForm) => {
    const queryList = [
      () => this.checkoutUserName(data),
      () => this.handleValideCode(data),
      () => this.handleValidePassword(data),
    ];
    queryList[this.currentStep]();
  });

  // 验证账号
  public checkoutUserName = action((data: FindPasswordForm) => {
    request({ url: `${api.checkUserName}?username=${data.username}` }).then((res: Response) => {
      if (res.data && !res.data.mobile) {
        this.errorInfo = '账号不存在';
        return;
      }
      const { token, mobile } = res.data;
      this.volidToken = token;
      this.volidMobile = mobile;
      this.currentStep = 1;
      this.errorInfo = '';
    })
      .catch((res: Response) => {
        message.destroy();
        this.errorInfo = res.data ? res.data.data : '账号不存在';
      });
  });

  // 验证图形验证码
  public showImageCode = (id: string, x: number, y: number): void => {
    if (!this.volidMobile) {
      message.error('请输入手机号');
      return;
    }
    console.log('x,y', x, y);
    new SlideVerify({
      width: 240,
      height: 120,
      x,
      y,
      parentId: id,
      sliderText: '拖动滑块完成拼图，获取手机验证码',
      onSuccess: () => {
        // 发送验证码
        request({
          data: { mobile: this.volidMobile },
          method: 'post',
          url: api.sendCode,
        }).then((res: Response) => {
          this.isSendCode = true;
          this.countDown = 60;
          this.handleCountDown();
        })
          .catch((res: Response) => {
            message.error(res.data.data);
          });
      },
    });
  };

  // 倒计时
  public handleCountDown = action(() => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown < 1) {
        clearInterval(this.timer);
        this.isSendCode = false;
      }
    }, 1000);
  });

  // 验证数字验证码
  public handleValideCode = (data: FindPasswordForm): void => {
    request({ url: `${api.validateCode}?code=${data.code}&mobile=${this.volidMobile}&token=${this.volidToken}` }).then(() => {
      this.currentStep = 2;
    })
      .catch((res: Response) => {
        this.errorInfo = res.data.data;
      });
  };

  // 验证密码
  public handleValidePassword = (data: FindPasswordForm): void => {
    request({
      method: 'post',
      url: api.newPassword,
      data: {
        password: data.newPassword,
        token: this.volidToken,
      },
    }).then((res: Response) => {
      message.success('密码修改成功');
      setTimeout(() => {
        window.location.href = this.loginPath;
      }, 2000);
    })
      .catch((res: Response) => {
        this.errorInfo = res.data.data;
      });
  };
}
