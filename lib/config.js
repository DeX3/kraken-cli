'use strict';

const appName = require('../package.json').name;

module.exports = require('rc')(appName, {
  currencyPair: {
    real: 'ZEUR',
    virtual: 'XXBT',
    exchange: 'XXBTZEUR'
  }
});
