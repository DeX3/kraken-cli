'use strict';

const kraken = require('../lib/kraken.js');

module.exports = {
  command: 'ticker',
  handler: async function() {
    const info = await kraken.getTickerInfo();

    console.log('Low:', info.low);
    console.log('High:', info.high);
    console.log('Average:', info.average);
    console.log('Ask:', info.ask);
    console.log('Bid:', info.bid);
  }
};
