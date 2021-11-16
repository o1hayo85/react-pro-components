module.exports = function(extraTheme = {}) {
  return {
    ...require('./theme'),
    ...require('./antdPatch'),
    ...extraTheme,
  };
};
