module.exports = function(utils) {
  return {
    less: { theme: require('egenie-config/lib/theme/index.js')() },
    otherConfig: { externals: require('egenie-config').webpackConfig.externals },
  };
};
