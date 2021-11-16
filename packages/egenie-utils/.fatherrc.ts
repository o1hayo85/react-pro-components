export default {
  esm: 'rollup',
  cjs: 'rollup',
  autoprefixer: {
    remove: false,
    grid: true,
  },
  cssModules: {generateScopedName: '[name]__[local]--[hash:base64:8]'},
  extractCSS: true,
  lessInRollupMode: {modifyVars: require('egenie-config/lib/theme/index.js')()},
  extraExternals: [
    'egenie-common',
    'antd',
    'axios',
    'lodash',
    'react',
    'react-dom',
    'mobx',
    'mobx-react',
    'mobx-react-lite',
    'moment',
    'qs',
    'react-dnd',
    'react-dnd-html5-backend',
    'egenie-data-grid',
    'react-sortable-hoc'
  ],
};
