module.exports = function(utils) {
  return {
    less: { theme: require('egenie-config/lib/theme/index.js')() },
    otherConfig: {
      optimization: {
        splitChunks: {
          cacheGroups: {
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
      },
      externals: require('egenie-config').webpackConfig.externals,
    },
  };
};
