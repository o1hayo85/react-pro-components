import { message } from 'antd';
import { BaseData, request } from '../request';
import { EnumShopType } from './printWayBill';

const APP_KEY = '4A7DD276D1A709CB16AF06DE925B8BF7';
const CUSTOMER_ID = 11211;
const cpCodeSpecial = 'SF';

export interface DecryptUserInfo {
  receiverProvince: string;
  pin: string;
  receiverCity: string;
  receiverDistrict: string;
  receiverAddress: string;
  receiverName: string;
  receiverTelephone: string;
  ordersNo: string;
  receiverMobile: string;
}

async function getSensitiveData(platform_order_code: string, token: string, cpCode: string): Promise<DecryptUserInfo[]> {
  const timestamp = new Date().getTime();
  const dateStr = new Date(timestamp).toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[:-]|\.\d{3}/g, '');

  const uuidResultJSON = await request<{ auth: string; uuid: string; }>({
    method: 'POST',
    url: '/jdhufu/order/user',
    headers: {
      'x-jdcloud-date': dateStr,
      'x-jdcloud-nonce': 'ed558a3b-9808-4edb-8597-187bda63a4f2',
    },
    params: {
      app_key: APP_KEY,
      customerId: CUSTOMER_ID,
      method: 'jingdong.hufu.order.getSensitiveData',
    },
    data: {
      orders_nos: platform_order_code,
      token,
      extendProps: cpCode === cpCodeSpecial ? { decryptMobile: true } : null,
      timestamp,
    },
  });

  const result: { orderSensitiveInfo: { orderList: DecryptUserInfo[]; }; } = await fetch(
    `https://hufu.cn-north-1.jdcloud-api.net/order/getSensitiveData?app_key=${APP_KEY}&customerId=${CUSTOMER_ID}&method=jingdong.hufu.order.getSensitiveData`,
    {
      method: 'POST',
      body: JSON.stringify({
        orders_nos: platform_order_code,
        token,
        ...(cpCode === cpCodeSpecial ? { extendProps: { decryptMobile: true }} : {}),
      }),
      mode: 'cors',
      headers: new Headers({
        'content-type': 'application/json;charset=UTF-8',
        'x-jdcloud-date': dateStr,
        'x-jdcloud-nonce': uuidResultJSON.uuid,
        authorization: uuidResultJSON.auth,
      }),
    }
  ).then((data) => data.json());

  if (Array.isArray(result?.orderSensitiveInfo?.orderList) && result.orderSensitiveInfo.orderList.length) {
    return result.orderSensitiveInfo.orderList;
  } else {
    message.warning({
      key: '获取解密信息失败',
      content: '获取解密信息失败',
    });
    throw new Error('获取解密信息失败');
  }
}

let shopTokenDic = {};

// 获取店铺对应token,通过平台单号找到行内数据对应的店铺id, 然后在shopTokenDic取token
async function getToken() {
  if (Object.keys(shopTokenDic).length) {
    return shopTokenDic;
  }

  const res = await request<BaseData<{[key: string]: string; }>>({
    method: 'POST',
    url: '/api/baseinfo/rest/shop/getToken',
    data: { ids: '2' },
  });
  shopTokenDic = res.data || {};
  return shopTokenDic;
}

export async function getWayBillSensitiveData(userDataList: any[], cpCode: string): Promise<void> {
  if (cpCodeSpecial === cpCode) {
    const shopTokenDic = await getToken();
    const tokenToPlatformOrderCode = userDataList.reduce((previous, current) => {
      const {
        shop_id,
        platform_order_code,
        platform_type,
      } = current.wmsOrder;
      if (platform_type === EnumShopType.jd) {
        const token = shopTokenDic[shop_id];
        if (token) {
          if (previous[token]) {
            previous[token] = `${previous[token]},${platform_order_code}`;
          } else {
            previous[token] = platform_order_code;
          }
        }
      }
      return previous;
    }, {});
    console.log('店铺token和平台单号的映射: ', tokenToPlatformOrderCode);

    const tokens = Object.keys(tokenToPlatformOrderCode);
    if (tokens.length) {
      const decryptUserList: DecryptUserInfo[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const decryptInfo: DecryptUserInfo[] = await getSensitiveData(tokenToPlatformOrderCode[tokens[i]], tokens[i], cpCode);
        decryptUserList.push(...decryptInfo);
      }

      if (decryptUserList.length) {
        const originUserInfoList = userDataList.map((info) => info.wmsOrder);
        decryptUserList.forEach((newUserInfo) => {
          // 平台单号， 省， 市， 区， 地址， 收货人姓名， 收货人电话， 收货人固定电话
          const {
            ordersNo,
            receiverProvince,
            receiverCity,
            receiverDistrict,
            receiverAddress,
            receiverName,
            receiverMobile,
            receiverTelephone,
          } = newUserInfo;

          const platformOrderCodeEqualItem = originUserInfoList.find((val) => (`${val.platform_order_code}`).includes(`${ordersNo}`));
          if (platformOrderCodeEqualItem) {
            platformOrderCodeEqualItem.province_name = receiverProvince;
            platformOrderCodeEqualItem.city_name = receiverCity;
            platformOrderCodeEqualItem.district_name = receiverDistrict;
            platformOrderCodeEqualItem.receiver_address_detail = receiverAddress; // FIXME:可能重复，要看实际打印出来的结果，如果重复删除receiver_address的赋值
            platformOrderCodeEqualItem.receiver_address = receiverAddress; // FIXME:可能重复
            platformOrderCodeEqualItem.receiver_name = receiverName;
            platformOrderCodeEqualItem.receiver_mobile = receiverMobile;
            platformOrderCodeEqualItem.receiver_phone = receiverTelephone;
          }
        });
        console.log('解密的userData: ', decryptUserList);
        console.log('组合完的userData: ', userDataList.map((item) => item.wmsOrder));
      }
    }
  }
}
