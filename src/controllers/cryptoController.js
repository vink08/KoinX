const CryptoPrice = require('../models/CryptoPrice');

async function getStats(req, res) {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const latestPrice = await CryptoPrice.findOne({ coinId: coin })
      .sort({ timestamp: -1 });

    if (!latestPrice) {
      return res.status(404).json({ error: 'No data found for the specified coin' });
    }

    res.json({
      price: latestPrice.priceUsd,
      marketCap: latestPrice.marketCapUsd,
      "24hChange": latestPrice.change24h
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDeviation(req, res) {
  try {
    const { coin } = req.query;

    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const prices = await CryptoPrice.find({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('priceUsd');

    if (prices.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified coin' });
    }

    const priceValues = prices.map(p => p.priceUsd);
    const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
    const squaredDiffs = priceValues.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / priceValues.length;
    const standardDeviation = Math.sqrt(variance);

    res.json({
      deviation: Number(standardDeviation.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating deviation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getStats,
  getDeviation
};