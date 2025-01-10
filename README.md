# Crypto Price Tracker

A Node.js application that tracks cryptocurrency prices using the CoinGecko API.

## Features

- Background job to fetch crypto prices every 2 hours
- API endpoints for latest price statistics and price deviation
- MongoDB integration for data storage
- Production-ready setup with error handling and logging

## Setup

1. Install dependencies:
\```bash
npm install
\```

2. Create a `.env` file with your MongoDB connection string and port:
\```
MONGODB_URI=mongodb://localhost:27017/crypto-tracker
PORT=3000
\```

3. Start the server:
\```bash
npm start
\```

For development with auto-reload:
\```bash
npm run dev
\```

## API Endpoints

### Get Latest Stats
GET `/api/stats?coin=bitcoin`
GET `https://koinx-bpyk.onrender.com/api/stats?coin=bitcoin`

### Get Price Deviation
GET `/api/deviation?coin=bitcoin`
GET `https://koinx-bpyk.onrender.com/api/deviation?coin=bitcoin`
