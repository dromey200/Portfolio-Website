// ====================================
// HORADRIC AI - BACKEND PRICE API
// Example Node.js/Express Server
// ====================================

/**
 * This is an example backend API that scrapes price data
 * Deploy this on Vercel, Netlify Functions, or your own server
 */

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cache to avoid excessive scraping
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

/**
 * Main price endpoint
 * GET /api/prices?item=Harlequin+Crest
 */
app.get('/api/prices', async (req, res) => {
    const itemName = req.query.item;
    
    if (!itemName) {
        return res.status(400).json({ error: 'Item name required' });
    }
    
    // Check cache
    const cached = cache.get(itemName);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
    }
    
    try {
        // Try scraping Diablo.Trade
        const priceData = await scrapeDiabloTrade(itemName);
        
        // Cache result
        cache.set(itemName, {
            data: priceData,
            timestamp: Date.now()
        });
        
        res.json(priceData);
        
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch price data',
            message: error.message 
        });
    }
});

/**
 * Scrape Diablo.Trade for item listings
 */
async function scrapeDiabloTrade(itemName) {
    const searchUrl = `https://diablo.trade/listings/items?search=${encodeURIComponent(itemName)}`;
    
    const response = await axios.get(searchUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    
    const $ = cheerio.load(response.data);
    
    const listings = [];
    
    // Parse listings (adjust selectors based on actual site structure)
    $('.listing-item').each((i, elem) => {
        const price = $(elem).find('.listing-price').text().trim();
        const date = $(elem).find('.listing-date').text().trim();
        const seller = $(elem).find('.listing-seller').text().trim();
        
        if (price) {
            listings.push({
                price: parsePrice(price),
                priceRaw: price,
                date: date,
                seller: seller
            });
        }
    });
    
    if (listings.length === 0) {
        throw new Error('No listings found');
    }
    
    // Calculate statistics
    const prices = listings.map(l => l.price).filter(p => p > 0);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return {
        name: itemName,
        avgPrice: formatPrice(avgPrice),
        minPrice: formatPrice(minPrice),
        maxPrice: formatPrice(maxPrice),
        estimatedPrice: `${formatPrice(minPrice)}-${formatPrice(maxPrice)} Gold`,
        tradeValue: priceToTradeValue(avgPrice),
        demand: calculateDemand(listings.length),
        recentListings: listings.slice(0, 10),
        totalListings: listings.length,
        source: 'diablo.trade',
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Parse price string to millions
 */
function parsePrice(priceStr) {
    const str = priceStr.toLowerCase().replace(/[,\s]/g, '');
    const match = str.match(/([\d.]+)\s*(m|b|k|million|billion|thousand)?/i);
    
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const unit = match[2];
    
    if (!unit || unit.startsWith('m')) return num;
    if (unit.startsWith('b')) return num * 1000;
    if (unit.startsWith('k')) return num / 1000;
    
    return num;
}

/**
 * Format price
 */
function formatPrice(millions) {
    if (millions >= 1000) return `${(millions / 1000).toFixed(1)}B`;
    if (millions >= 1) return `${millions.toFixed(0)}M`;
    return `${(millions * 1000).toFixed(0)}K`;
}

/**
 * Convert price to trade value
 */
function priceToTradeValue(millions) {
    if (millions >= 500) return 'Extremely High';
    if (millions >= 200) return 'Very High';
    if (millions >= 100) return 'High';
    if (millions >= 50) return 'Medium-High';
    if (millions >= 20) return 'Medium';
    if (millions >= 10) return 'Low-Medium';
    return 'Low';
}

/**
 * Calculate demand based on listing count
 */
function calculateDemand(listingCount) {
    if (listingCount > 50) return 'very_high';
    if (listingCount > 20) return 'high';
    if (listingCount > 10) return 'medium';
    return 'low';
}

/**
 * Clear cache endpoint (for testing)
 */
app.post('/api/cache/clear', (req, res) => {
    cache.clear();
    res.json({ message: 'Cache cleared' });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        cache_size: cache.size,
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Price API running on port ${PORT}`);
});

// ====================================
// DEPLOYMENT OPTIONS
// ====================================

/*
1. VERCEL (Recommended - Free tier)
   - Create /api/prices.js in your project
   - Deploy with: vercel deploy
   - Auto-scaling, free SSL

2. NETLIFY FUNCTIONS
   - Create /netlify/functions/prices.js
   - Deploy with: netlify deploy
   - Free tier available

3. RAILWAY / RENDER
   - Deploy this entire Express app
   - Free tier available
   - More control over server

4. YOUR OWN VPS
   - DigitalOcean, Linode, AWS
   - Full control
   - Requires server management
*/

module.exports = app;
