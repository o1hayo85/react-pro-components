const mock = require('mockjs');

module.exports = {
  'GET /abcdef/': mock.mock({
    'list|100': [
      {
        name: '@city',
        'value|1-100': 50,
        'type|0-2': 1,
      },
    ],
  }),
};
