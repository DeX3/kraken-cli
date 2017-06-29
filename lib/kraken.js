'use strict';

const config = require('./config.js');

const Promise = require('bluebird');
const KrakenClient = require('kraken-api');
const client = new KrakenClient(config.apiKey, config.apiSecret, { timeout: 20000 });
const krakenApiRaw = Promise.promisify(client.api, { context: client });
const _ = require('lodash');
const log = require('debug')('kraken');

const krakenApi = function() {
  return krakenApiRaw(...arguments).then(function(resp) {
    return resp.result;
  });
};

module.exports = {
  /**
   * options:
      pair: config.currencyPair.exchange,
      type: 'buy',
      ordertype: options.orderType,
      price: options.price,
      expiretm: '+60',
      volume: options.volume.toString()
   */
  buy: async function buy(options) {
    options = _.merge({}, { pair: config.currencyPair.exchange }, options, { type: 'buy' });
    log('AddOrder', options);
    const resp = await krakenApi('AddOrder', options);
    log('AddOrder', resp);

    return resp;
  },

  getOrders: async function(ids) {
    log('QueryOrders', ids);
    return await krakenApi('QueryOrders', { txid: ids.join(',') });
  },

  getOrder: async function(id) {
    const orders = await module.exports.getOrders([id]);

    return orders[id];
  },

  getBalance: async function() {
    log('Balance');
    return _.mapValues(await krakenApi('Balance', null), s => parseFloat(s, 10));
  },

  getTickerInfo: async function(pairs = [config.currencyPair.exchange]) {
    const args = { pair: pairs.join(',') };
    log('Ticker', args);
    const result = await krakenApi('Ticker', args);

    log('Ticker', result);
    return _.mapValues(result, function(exchange) {
      return _.mapValues(
        {
          low: exchange.l[1],
          high: exchange.h[1],
          average: exchange.p[1],
          ask: exchange.a[0],
          bid: exchange.b[0]
        },
        s => parseFloat(s, 10)
      );
    });
  }
};
