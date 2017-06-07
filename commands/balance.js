'use strict';

const kraken = require('../lib/kraken.js');
const _ = require('lodash');

module.exports = {
  command: 'balance',
  handler: async function() {
    const balance = await kraken.getBalance();

    _.each(balance, function(value, currency) {
      console.log(`${currency}: ${value}`);
    });
  }
};
