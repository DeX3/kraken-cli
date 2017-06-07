'use strict';

const kraken = require('../lib/kraken.js');

module.exports = {
  command: 'ticker',
  builder: function(yargs) {
    return yargs.option('raw', {
      alias: 'r',
      type: 'boolean',
      default: false
    });
  },
  handler: async function(argv) {
    try {
      const info = await kraken.getTickerInfo();

      if (argv.raw) {
        console.log(JSON.stringify(info, null, 2));
      } else {
        console.log('Low:', info.low);
        console.log('High:', info.high);
        console.log('Average:', info.average);
        console.log('Ask:', info.ask);
        console.log('Bid:', info.bid);
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
};
