const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const utils = require('./utils');

module.exports = {
  usedExports: true,
  sideEffects: true,
  concatenateModules: true,
  minimize: utils.isProduction,
  minimizer: utils.isProduction ? [
    // This is only used in production mode
    new TerserPlugin({
      terserOptions: {
        parse: {
          /*
           * We want terser to parse ecma 8 code. However, we don't want it
           * to apply any minification steps that turns valid ecma 5 code
           * into invalid ecma 5 code. This is why the 'compress' and 'output'
           * sections only apply transformations that are ecma 5 safe
           * https://github.com/facebook/create-react-app/pull/4234
           */
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,

          /*
           * Disabled because of an issue with Uglify breaking seemingly valid code:
           * https://github.com/facebook/create-react-app/issues/2376
           * Pending further investigation:
           * https://github.com/mishoo/UglifyJS2/issues/2011
           */
          comparisons: false,

          /*
           * Disabled because of an issue with Terser breaking valid code:
           * https://github.com/facebook/create-react-app/issues/5250
           * Pending further investigation:
           * https://github.com/terser-js/terser/issues/120
           */
          inline: 2,
        },
        mangle: { safari10: true },

        // Added for profiling in devtools
        keep_classnames: false,
        keep_fnames: false,
        output: {
          ecma: 5,
          comments: false,

          /*
           * Turned on because emoji and regex is not minified properly using default
           * https://github.com/facebook/create-react-app/issues/2488
           */
          ascii_only: true,
        },
      },
    }),

    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          { discardComments: { removeAll: true }},
        ],
      },
    }),
  ] : [],

  /*
   * Automatically split vendor and commons
   * https://twitter.com/wSokra/status/969633336732905474
   * https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
   */
  splitChunks: {
    chunks: 'all',
    minSize: utils.splitChunkMinSize,
    name: false,
    cacheGroups: {},
  },

  /*
   * Keep the runtime chunk separated to enable long term caching
   * https://twitter.com/wSokra/status/969679223278505985
   * https://github.com/facebook/create-react-app/issues/5358
   */
  runtimeChunk: { name: (entryPoint) => `runtime-${entryPoint.name}` },
};
