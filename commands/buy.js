'use strict';

const Promise = require('bluebird');
const kraken = require('../lib/kraken.js');
const config = require('../lib/config.js');
const REAL = config.currencyPair.real;
const VIRT = config.currencyPair.virtual;

module.exports = {
  command: 'buy',
  builder: function(yargs) {
    return yargs
      .option('currency-amount', {
        type: 'number',
        description: 'The amount of real currency to spend'
      })
      .option('wait-for-completion', {
        alias: 'w',
        type: 'boolean',
        description: 'Block until the order has completed successfully',
        default: false
      })
      .help();
  },
  handler: async function(argv) {
    try {
      const resp = await kraken.getTickerInfo();
      const ask = resp.ask;
      const btcAmount = argv.currencyAmount / ask;

      console.error('Current ask price is', REAL, ask);
      console.error('Can buy', VIRT, btcAmount, 'for', REAL, argv.currencyAmount, 'right now');

      let order = await kraken.buy({
        ordertype: 'market',
        volume: btcAmount.toString(),
        oflags: 'fcib'
      });

      console.error('Successfully created new order:', order);

      if (argv.waitForCompletion) {
        for (;;) {
          order = await kraken.getOrder(order.txid[0]);

          if (order.status !== 'closed') {
            console.log('Order not yet closed, waiting...');
            await Promise.delay(1000);
          } else {
            break;
          }
        }

        console.error('Order successfully closed');
        console.log(JSON.stringify(order, null, 2));
      }
    } catch (e) {
      console.error(e);
    }
  }
};
