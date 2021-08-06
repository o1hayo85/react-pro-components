const api = {
  templateList: '/api/boss/baseinfo/rest/export/template/config/list', // 导出模板列表查询
  saveTemplate: '/api/boss/baseinfo/rest/export/template/config/save', // 导出模板保存
  delTemplate: '/api/boss/baseinfo/rest/export/template/config/delete', // 删除导出模板
  templateColumnList: '/api/boss/baseinfo/rest/export/column/config/list', // 配置模板字段列表 包括自定义属性
  exportCommit: '/api/boss/baseinfo/rest/export/task/commit', // 提交导出
  getExportConfig: '/api/boss/baseinfo/rest/whiteList/export/config/getExportConfig', // 获取导出配置
};

export default api;
