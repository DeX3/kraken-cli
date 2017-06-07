'use strict';

const config = require('./config.js');

const Promise = require('bluebird');
const KrakenClient = require('kraken-api');
const client = new KrakenClient(config.apiKey, config.apiSecret);
const krakenApiRaw = Promise.promisify(client.api, { context: client });
const _ = require('lodash/fp');

const krakenApi = function() {
  return krakenApiRaw(...arguments).then(function(resp) {
    return resp.result;
  });
};

module.exports = {
  buy: function buy(amount, limit) {
    return krakenApi('AddOrder', {
      pair: config.currencyPair.exchange,
      type: 'buy',
      ordertype: 'limit',
      price: limit.toString(),
      expiretm: '+60',
      volume: amount.toString()
    }).then(function(result) {
      return new Order(result.txid, result.descr.order);
    });
  },

  sell: function sell(amount, limit) {
    return krakenApi('AddOrder', {
      pair: config.currencyPair.exchange,
      type: 'sell',
      ordertype: 'limit',
      price: limit.toString(),
      expiretm: '+60',
      volume: amount.toString()
    }).then(function(result) {
      return new Order(result.txid, result.descr.order);
    });
  },

  getOrders: function(ids) {
    return krakenApi('QueryOrders', { txid: ids.join(',') });
  },

  getBalance: function() {
    return krakenApi('Balance', null).then(result => _.mapValues(s => parseFloat(s, 10), result));
  },

  getTickerInfo: function() {
    return krakenApi('Ticker', { pair: config.currencyPair.exchange }).then(function(result) {
      const exchange = result[config.currencyPair.exchange];

      return _.mapValues(s => parseFloat(s, 10), {
        low: exchange.l[1],
        high: exchange.h[1],
        average: exchange.p[1],
        ask: exchange.a[0],
        bid: exchange.b[0]
      });
    });
  }
};

function Order(id, description) {
  this.id = id;
  this.description = description;
}
