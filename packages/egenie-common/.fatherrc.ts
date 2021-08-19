export default {
  esm: {
    type: 'rollup',
    mjs: true,
    minify: true,
  },
  cjs: {
    type: 'rollup',
    minify: true,
  },
  autoprefixer: {
    remove: false,
    grid: true,
  },
  cssModules: { generateScopedName: '[name]__[local]--[hash:base64:8]' },
  extractCSS: true,
  extraExternals: [
    'antd',
    'lodash',
    'qs',
    'axios',
    'react',
    'react-dom',
    'react-router-dom',
    'mobx',
    'mobx-react',
    'mobx-react-lite',
    'moment',
    'react-dnd',
    'react-dnd-html5-backend',
  ],
};
