const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const utils = require('./utils');

function getStyleLoaders(cssOptions, preProcessor) {
  const loaders = [
    utils.isDevelopment && require.resolve('style-loader'),
    utils.isProduction && MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: {
        import: true,
        url: true,
        ...cssOptions,
      },
    },
    { loader: require.resolve('postcss-loader') },
  ].filter(Boolean);

  if (preProcessor) {
    const loaderConfig = {
      loader: require.resolve(preProcessor),
      options: {},
    };
    if (preProcessor === 'less-loader') {
      loaderConfig.options.lessOptions = {
        javascriptEnabled: true,
        modifyVars: utils.less.theme,
      };
    }

    loaders.push(loaderConfig);
  }

  return loaders;
}

function getGlobalStyle(suffix) {
  return path.resolve(paths.appSrc, `global.${suffix}`);
}

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = [
  {
    test: /\.module\.css$/,
    include: [paths.appSrc],
    use: getStyleLoaders({ modules: { localIdentName: '[name]__[local]--[hash:base64:8]' }}),
  },
  {
    test: /\.css$/,
    use: getStyleLoaders(),
  },
  {
    test: /\.less$/,
    include: [
      getGlobalStyle('less'),
      /node_modules/,
    ],
    exclude: [...utils.less.moduleInclude],
    use: getStyleLoaders({}, 'less-loader'),
  },
  {
    test: /\.less$/,
    include: [
      paths.appSrc,
      ...utils.less.moduleInclude,
    ],
    exclude: getGlobalStyle('less'),
    use: getStyleLoaders({ modules: { localIdentName: '[name]__[local]--[hash:base64:8]' }}, 'less-loader'),
  },
  utils.allowSass && {
    test: sassModuleRegex,
    include: [paths.appSrc],
    use: getStyleLoaders({ modules: { localIdentName: '[name]__[local]--[hash:base64:8]' }}, 'sass-loader'),
  },
  utils.allowSass && {
    test: sassRegex,
    exclude: [sassModuleRegex],
    use: getStyleLoaders({}, 'sass-loader'),
  },
].filter(Boolean);
