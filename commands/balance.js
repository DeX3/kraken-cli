'use strict';

const kraken = require('../lib/kraken.js');
const _ = require('lodash');

module.exports = {
  command: 'balance',
  builder: function(yargs) {
    return yargs.option('raw', {
      alias: 'r',
      type: 'boolean',
      default: false
    });
  },
  handler: async function(argv) {
    try {
      const balance = await kraken.getBalance();

      if (argv.raw) {
        console.log(JSON.stringify(balance, null, 2));
      } else {
        _.each(balance, function(value, currency) {
          console.log(`${currency}: ${value}`);
        });
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
};
