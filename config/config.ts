import { defineConfig } from 'dumi';

export default defineConfig({
  title: '杉数前端文档',
  favicon: 'https://front.runscm.com/customer-source/common/favicon.ico',
  logo: 'https://front.runscm.com/customer-source/common/favicon.ico',
  outputPath: 'docs-dist',
  hash: true,
  mode: 'site',
  locales: [
    [
      'zh-CN',
      '中文',
    ],
    [
      'en-US',
      'English',
    ],
  ],
  navs: {
    'zh-CN': [
      null,
      {
        title: 'GitLab',
        path: 'http://192.168.200.111:9980/egFrontend/egenie-utils',
      },
      {
        title: '更新日志',
        path: 'http://192.168.200.111:9980/egFrontend/egenie-utils/-/blob/master/CHANGELOG.md',
      },
    ],
    'en-US': [
      null,
      {
        title: 'GitLab',
        path: 'http://192.168.200.111:9980/egFrontend/egenie-utils',
      },
      {
        title: '更新日志',
        path: 'http://192.168.200.111:9980/egFrontend/egenie-utils/-/blob/master/CHANGELOG.md',
      },
    ],
  },
  exportStatic: {},
});
