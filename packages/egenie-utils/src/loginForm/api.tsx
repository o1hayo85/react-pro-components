export const api = {
  // 静态资源
  oss: 'https://front.runscm.com/egenie-common',

  // 用户信息
  user: '/api/dashboard/user', // 用户
  changePassword: '/api/iac/user/changePassword', // 修改密码
  userPerms: '/api/iac/role/user/perms', // 按钮权限列表
  announcement: 'announcement/findAnnouncements', // 系统更新

  // 登录
  login: '/user_login', // 登录
  getAuthImage: '/api/iac/authImage/anon/getAuthImage', // 获取图片验证码

  // 字典
  getDict: '/api/gim/anon/dict', // {type}

  // 注册
  marketList: '/api/gim/rest/anon/market/findAllMarket', // 市场列表
  register: '/api/iac/user/anon/register', // 注册新用户
  findMarketCity: '/api/gim/rest/anon/market/findMarketCity', // 查城市
  findByCityIds: '/api/gim/rest/anon/market/findByCityIds', // 根据城市查市场
  findFloor: '/api/gim/anon/floor/findFloor', // 查楼层
  queryRepeatShop: '/api/pos/baseinfo/rest/shop/anon/queryRepeatShop', // 检查档口好是否重复
  findOneLevel: '/api/gim/category/anon/findOneLevel', // 获取主营分类【一级】
  userCheck: '/api/iac/user/check', // 验证手机号是否存在

  // 忘记密码
  checkUserName: '/api/iac/user/anon/findByUsername', // 验证用户是否存在
  sendCode: '/api/iac/validCode/anon/send', // 发送验证码
  validateCode: '/api/iac/validCode/anon/password/reset/validate', // 验证手机号验证码
  newPassword: '/api/iac/user/anon/password/reset', // 修改密码
};
