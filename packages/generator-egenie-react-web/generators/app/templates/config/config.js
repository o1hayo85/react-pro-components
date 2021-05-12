module.exports = function(utils) {
  return {
    babel: { include: [/egenie-utils/]},
    less: {
      moduleInclude: [/egenie-utils/],
      theme: {
        'blue-6': '#1978ff',
        'font-size-base': '12px',
        'border-color-base': '#e2e2e5',
        'background-color-light': '#f6f7f8',
        'table-selected-row-bg': '#d3e5ff',
        'modal-footer-border-width': 0,
        'card-shadow': '2px 2px 5px 0 rgba(230 225 225 0.5)',
        'card-padding-base': '16px',
        'zindex-message': 9999,
      },
    },
    otherConfig: {
      optimization: utils.isProduction ? {
        splitChunks: {
          cacheGroups: {
            // 拆分第三方库
            vendors: {
              test: /node_modules/,
              name: 'vendors',
              chunks: 'initial',
              minChunks: 2,
              priority: 1,
            },

            // 拆导入导出
            excel: {
              test: /egenie-import-export/,
              name: 'excel',
              chunks: 'all',
              minChunks: 1,
              priority: 100,
            },
          },
        },
      } : {},
      externals: {
        lodash: {
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: 'lodash',
          root: '_',
        },
        echarts: {
          commonjs: 'echarts',
          commonjs2: 'echarts',
          amd: 'echarts',
          root: 'echarts',
        },
        qs: {
          commonjs: 'qs',
          commonjs2: 'qs',
          amd: 'qs',
          root: 'Qs',
        },
        axios: {
          commonjs: 'axios',
          commonjs2: 'axios',
          amd: 'axios',
          root: 'axios',
        },
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React',
        },
        'react-dom': {
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'react-dom',
          root: 'ReactDOM',
        },
        mobx: {
          commonjs: 'mobx',
          commonjs2: 'mobx',
          amd: 'mobx',
          root: 'mobx',
        },
        'mobx-react': {
          commonjs: 'mobx-react',
          commonjs2: 'mobx-react',
          amd: 'mobx-react',
          root: 'mobxReact',
        },
        'mobx-react-lite': {
          commonjs: 'mobx-react-lite',
          commonjs2: 'mobx-react-lite',
          amd: 'mobx-react-lite',
          root: 'mobxReactLite',
        },
        moment: {
          commonjs: 'moment',
          commonjs2: 'moment',
          amd: 'moment',
          root: 'moment',
        },
        'reflect-metadata': {
          commonjs: 'reflect-metadata',
          commonjs2: 'reflect-metadata',
          amd: 'reflect-metadata',
          root: 'Reflect',
        },
        'react-dnd': {
          commonjs: 'react-dnd',
          commonjs2: 'react-dnd',
          amd: 'react-dnd',
          root: 'ReactDnD',
        },
        'react-dnd-html5-backend': {
          commonjs: 'react-dnd-html5-backend',
          commonjs2: 'react-dnd-html5-backend',
          amd: 'react-dnd-html5-backend',
          root: 'ReactDnDHTML5Backend',
        },
      },
    },
  };
};
