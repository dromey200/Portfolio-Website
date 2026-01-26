# HORADRIC AI - LIVE PRICE DATA INTEGRATION GUIDE

## 📊 Current State vs. Live Data

### **Current (Static):**
- Manual price updates in `pricing.js`
- Data can be outdated
- ✅ Fast (no API calls)
- ✅ No backend needed
- ❌ Requires manual maintenance

### **Live Pricing:**
- Real-time market data
- Always up-to-date
- ❌ Requires API calls
- ❌ Needs backend (for CORS)
- ✅ Automatic updates

---

## 🎯 RECOMMENDED APPROACH

### **Hybrid Model (Best of Both Worlds)**

1. **Static database** as fallback
2. **Live API** for popular items
3. **Community reports** for new items
4. **Caching** to minimize API calls

---

## 🚀 IMPLEMENTATION OPTIONS

### **Option 1: Community-Powered (Easiest)** ⭐

Use the **crowdsourced pricing** you already have:

```javascript
// In app.js, update saveToHistory():
async saveToHistory(text, rarity, tradeQuery, cost) {
    const title = (text.match(/\*\*(.*?)\*\*/)?.[1] || 'Item').substring(0, 100);
    
    // Get verdict
    const verdictMatch = text.match(/\*\*Verdict:\*\*\s*(KEEP|SALVAGE)/i);
    const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : null;
    
    // Try community pricing first, then static database
    let marketPrice = null;
    const communityData = CommunityPricing.getAveragePrice(title);
    if (communityData) {
        marketPrice = communityData.avgPrice;
    } else {
        const priceData = PriceDatabase.searchItem(title);
        if (priceData) {
            marketPrice = priceData.tradeValue;
        }
    }
    
    // ... rest of code
}
```

**Pros:**
- ✅ No backend needed
- ✅ Free
- ✅ Gets better over time
- ✅ Already implemented

**Cons:**
- ❌ Requires user reports
- ❌ Limited data initially

---

### **Option 2: Backend API (Most Powerful)** 🔥

Deploy a backend that scrapes Diablo.Trade:

#### **A. Create Vercel Serverless Function**

Create `/api/prices.js`:

```javascript
// Vercel Serverless Function
const axios = require('axios');
const cheerio = require('cheerio');

// Cache
const cache = new Map();

module.exports = async (req, res) => {
    const { item } = req.query;
    
    // Check cache
    const cached = cache.get(item);
    if (cached && Date.now() - cached.time < 3600000) {
        return res.json(cached.data);
    }
    
    try {
        // Scrape Diablo.Trade
        const response = await axios.get(
            `https://diablo.trade/listings/items?search=${encodeURIComponent(item)}`
        );
        
        const $ = cheerio.load(response.data);
        
        // Parse listings
        const listings = [];
        $('.listing-item').each((i, elem) => {
            const price = $(elem).find('.price').text();
            if (price) listings.push(parsePrice(price));
        });
        
        // Calculate average
        const avgPrice = listings.reduce((a, b) => a + b, 0) / listings.length;
        
        const data = {
            name: item,
            avgPrice: formatPrice(avgPrice),
            tradeValue: priceToValue(avgPrice),
            listings: listings.length,
            source: 'diablo.trade',
            updated: new Date().toISOString()
        };
        
        // Cache
        cache.set(item, { data, time: Date.now() });
        
        res.json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function parsePrice(str) {
    const match = str.match(/([\d.]+)\s*(m|b|k)/i);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'b') return num * 1000;
    if (unit === 'k') return num / 1000;
    return num;
}

function formatPrice(millions) {
    if (millions >= 1000) return `${(millions / 1000).toFixed(1)}B Gold`;
    return `${millions.toFixed(0)}M Gold`;
}

function priceToValue(millions) {
    if (millions >= 500) return 'Extremely High';
    if (millions >= 200) return 'Very High';
    if (millions >= 100) return 'High';
    if (millions >= 50) return 'Medium-High';
    if (millions >= 20) return 'Medium';
    return 'Low-Medium';
}
```

#### **B. Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd your-project
vercel deploy

# Your API will be at:
# https://your-project.vercel.app/api/prices?item=Harlequin+Crest
```

#### **C. Update Frontend**

In `app.js`:

```javascript
async saveToHistory(text, rarity, tradeQuery, cost) {
    // ... existing code ...
    
    // Fetch live price
    let marketPrice = null;
    try {
        const response = await fetch(
            `https://your-project.vercel.app/api/prices?item=${encodeURIComponent(title)}`
        );
        const data = await response.json();
        marketPrice = data.tradeValue;
    } catch (e) {
        // Fallback to static
        const priceData = PriceDatabase.searchItem(title);
        if (priceData) marketPrice = priceData.tradeValue;
    }
    
    // ... rest of code ...
}
```

**Pros:**
- ✅ Real-time data
- ✅ Always accurate
- ✅ Auto-updating
- ✅ Vercel free tier

**Cons:**
- ❌ Requires backend deployment
- ❌ Scraping may break if site changes
- ❌ Rate limits

---

### **Option 3: Third-Party API (If Available)** 💰

Wait for official Diablo.Trade API:

```javascript
async function fetchPrice(itemName) {
    const response = await fetch('https://api.diablo.trade/v1/prices', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: itemName })
    });
    
    return await response.json();
}
```

**Status:** Not available yet (as of Jan 2026)

---

## 📋 MY RECOMMENDATION

### **Start with Hybrid:**

1. **Keep static database** (60+ items already)
2. **Add community pricing** (already built)
3. **Deploy backend API** (when you have 1000+ users)

### **Phase 1: Now** (Community-Powered)
```javascript
// Priority order:
1. Community reports (if available)
2. Static database (fallback)
3. Show "No data" if neither
```

### **Phase 2: Later** (Backend API)
```javascript
// Priority order:
1. Backend API (live scraping)
2. Community reports (if API fails)
3. Static database (final fallback)
```

---

## 🛠️ QUICK IMPLEMENTATION

### **Add to `app.js` now:**

```javascript
async saveToHistory(text, rarity, tradeQuery, cost) {
    const title = (text.match(/\*\*(.*?)\*\*/)?.[1] || 'Item').substring(0, 100);
    
    const verdictMatch = text.match(/\*\*Verdict:\*\*\s*(KEEP|SALVAGE)/i);
    const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : null;
    
    // 🔥 HYBRID PRICING: Community → Static → None
    let marketPrice = null;
    let priceSource = null;
    
    // Try community first
    if (typeof CommunityPricing !== 'undefined') {
        const communityData = CommunityPricing.getAveragePrice(title);
        if (communityData && communityData.sampleSize >= 3) {
            marketPrice = communityData.avgPrice;
            priceSource = `community (${communityData.sampleSize} reports)`;
        }
    }
    
    // Fallback to static database
    if (!marketPrice) {
        const priceData = PriceDatabase.searchItem(title);
        if (priceData) {
            marketPrice = priceData.tradeValue;
            priceSource = 'database';
        }
    }
    
    const item = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title,
        text: text.substring(0, 5000),
        rarity,
        tradeQuery,
        playerClass: this.el.playerClass.value,
        provider: 'gemini',
        model: this.state.currentModel,
        cost: cost,
        verdict: verdict,
        marketPrice: marketPrice,
        priceSource: priceSource  // Track where price came from
    };
    
    // ... rest of existing code ...
}
```

---

## 📊 COST COMPARISON

| Option | Setup Time | Monthly Cost | Accuracy | Maintenance |
|--------|-----------|--------------|----------|-------------|
| Static DB | 0 min | $0 | Medium | High (manual) |
| Community | 30 min | $0 | Medium+ | Low (auto) |
| Backend API | 2-4 hrs | $0-5 | High | Medium |
| Paid API | 5 min | $50-200 | Very High | None |

---

## 🎯 ACTION ITEMS

### **Today:**
1. ✅ Keep static database
2. ✅ Use community pricing as supplement
3. ✅ Add "Report Price" feature (already built)

### **Next Month:**
1. Deploy Vercel backend API
2. Scrape Diablo.Trade every hour
3. Cache results
4. Switch to live data

### **Long Term:**
1. Partner with Diablo.Trade for API access
2. Build price history charts
3. Add price alerts
4. Predictive pricing ML model

---

## 📦 FILES TO ADD

If you want backend API now:
1. `live-pricing.js` (frontend integration)
2. `backend-price-api.js` (Vercel function)
3. Deploy to Vercel

**Want me to set this up for you?** I can configure the hybrid approach right now! 🚀
