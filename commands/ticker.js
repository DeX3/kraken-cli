'use strict';

const _ = require('lodash');
const kraken = require('../lib/kraken.js');
const config = require('../lib/config.js');

module.exports = {
  command: 'ticker',
  builder: function(yargs) {
    return yargs
      .option('exchanges', {
        alias: 'x',
        type: 'array',
        description: 'Exchange(s) to query',
        default: [config.currencyPair.exchange]
      })
      .option('raw', {
        alias: 'r',
        type: 'boolean',
        default: false
      });
  },
  handler: async function(argv) {
    try {
      const info = await kraken.getTickerInfo(argv.exchanges);

      if (argv.raw) {
        console.log(JSON.stringify(info, null, 2));
      } else {
        _.each(info, function(data, exchange) {
          console.log(exchange, 'Low:', data.low);
          console.log(exchange, 'High:', data.high);
          console.log(exchange, 'Average:', data.average);
          console.log(exchange, 'Ask:', data.ask);
          console.log(exchange, 'Bid:', data.bid);
        });
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
};
