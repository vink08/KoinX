const cron = require('node-cron');
const axios = require('axios');
const CryptoPrice = require('../models/CryptoPrice');

const COINS = ['bitcoin', 'matic-network', 'ethereum'];
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

async function fetchCryptoPrices() {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: COINS.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true
      }
    });

    const prices = [];
    for (const coinId of COINS) {
      const data = response.data[coinId];
      prices.push({
        coinId,
        priceUsd: data.usd,
        marketCapUsd: data.usd_market_cap,
        change24h: data.usd_24h_change
      });
    }

    await CryptoPrice.insertMany(prices);
    console.log('Prices updated successfully');
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
}

function startPriceTracker() {
  fetchCryptoPrices();
  
  // Schedule to run every 2 hours
  cron.schedule('0 */2 * * *', fetchCryptoPrices);
// cron.schedule('* * * * *', fetchCryptoPrices); 
}

module.exports = { startPriceTracker };