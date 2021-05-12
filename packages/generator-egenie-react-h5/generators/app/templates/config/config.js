module.exports = function(utils) {
  return {
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
