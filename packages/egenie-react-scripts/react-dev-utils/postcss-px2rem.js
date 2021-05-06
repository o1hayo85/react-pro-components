'use strict';

const postcss = require('postcss');
const Px2rem = require('px2rem');

module.exports = (options) => {
  return {
    postcssPlugin: 'postcss-px2rem',
    Once: (css, { result }) => {
      const oldCssText = css.toString();
      const px2remIns = new Px2rem(options);
      const newCssText = px2remIns.generateRem(oldCssText);
      const newCssObj = postcss.parse(newCssText);
      result.root = newCssObj;
    },
  };
};