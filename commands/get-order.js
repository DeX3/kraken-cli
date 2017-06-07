'use strict';

const kraken = require('../lib/kraken.js');

module.exports = {
  command: 'get-order <orderId>',
  handler: async function(argv) {
    const resp = await kraken.getOrder(argv.orderId);

    console.log(resp);
  }
};
