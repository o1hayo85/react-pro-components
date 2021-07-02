const { getThemeVariables } = require('antd/dist/theme');

const baseTheme = getThemeVariables({
  dark: false, // 开启暗黑模式
  compact: false, // 开启紧凑模式
});

module.exports = function(extraTheme = {}) {
  return {
    ...require('./theme'),
    ...baseTheme,
    ...require('./antdPatch'),
    ...extraTheme,
  };
};
