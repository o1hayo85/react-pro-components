module.exports = function(utils) {
  return { otherConfig: { externals: require('egenie-config').webpackConfig.externals }};
};
