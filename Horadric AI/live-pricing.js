// ====================================
// HORADRIC AI - LIVE PRICE FETCHER
// Version: 2.0.2
// ====================================

/**
 * Fetch live price data from trading platforms
 * Uses multiple sources for best accuracy
 */

const LivePricing = {
    cache: new Map(),
    cacheExpiry: 3600000, // 1 hour
    
    /**
     * Get price data for an item (with caching)
     */
    async getPrice(itemName) {
        // Check cache first
        const cached = this.cache.get(itemName);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        
        // Try multiple sources
        let priceData = null;
        
        try {
            // Try Diablo.Trade first (most reliable)
            priceData = await this.fetchFromDiabloTrade(itemName);
        } catch (e) {
            console.warn('Diablo.Trade fetch failed:', e);
        }
        
        if (!priceData) {
            try {
                // Fallback to D4Armory
                priceData = await this.fetchFromD4Armory(itemName);
            } catch (e) {
                console.warn('D4Armory fetch failed:', e);
            }
        }
        
        if (!priceData) {
            // Final fallback to static database
            priceData = PriceDatabase.searchItem(itemName);
            if (priceData) {
                priceData.source = 'static_database';
            }
        }
        
        // Cache result
        if (priceData) {
            this.cache.set(itemName, {
                data: priceData,
                timestamp: Date.now()
            });
        }
        
        return priceData;
    },
    
    /**
     * Fetch from Diablo.Trade (scraping approach)
     */
    async fetchFromDiabloTrade(itemName) {
        // This would require a backend proxy to avoid CORS
        // Example structure of what you'd get back:
        
        /*
        return {
            name: itemName,
            rarity: 'unique',
            tradeValue: 'Very High',
            estimatedPrice: '100M-200M Gold',
            recentListings: [
                { price: '150M', date: '2026-01-15' },
                { price: '175M', date: '2026-01-14' }
            ],
            avgPrice: '162M Gold',
            demand: 'very_high',
            source: 'diablo.trade',
            lastUpdated: new Date().toISOString()
        };
        */
        
        throw new Error('Diablo.Trade API not available - requires backend proxy');
    },
    
    /**
     * Fetch from D4Armory
     */
    async fetchFromD4Armory(itemName) {
        // D4Armory has some pricing data
        // Would also require backend proxy
        
        throw new Error('D4Armory API not available - requires backend proxy');
    },
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    },
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            items: Array.from(this.cache.keys())
        };
    }
};

// ====================================
// BACKEND API INTEGRATION
// ====================================

/**
 * If you set up a backend API, use this approach instead
 */
const BackendPricing = {
    apiEndpoint: 'https://api.yourdomain.com/prices',
    
    /**
     * Fetch price from your backend API
     */
    async getPrice(itemName) {
        try {
            const response = await fetch(`${this.apiEndpoint}?item=${encodeURIComponent(itemName)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                name: data.name,
                rarity: data.rarity,
                tradeValue: data.tradeValue,
                estimatedPrice: data.estimatedPrice,
                demand: data.demand,
                avgPrice: data.avgPrice,
                recentListings: data.recentListings,
                source: 'backend_api',
                lastUpdated: data.lastUpdated
            };
        } catch (error) {
            console.error('Backend API fetch failed:', error);
            return null;
        }
    }
};

// ====================================
// COMMUNITY PRICE AGGREGATOR
// ====================================

/**
 * Aggregate prices from crowdsourced reports
 */
const CommunityPricing = {
    /**
     * Get average price from community reports
     */
    getAveragePrice(itemName) {
        const reports = CrowdsourcedPricing.getReportsForItem(itemName);
        
        if (reports.length === 0) {
            return null;
        }
        
        // Parse prices (rough estimation)
        const prices = reports.map(r => this.parsePriceString(r.observedPrice)).filter(p => p > 0);
        
        if (prices.length === 0) {
            return null;
        }
        
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        return {
            name: itemName,
            avgPrice: `${this.formatPrice(avgPrice)} Gold`,
            tradeValue: this.priceToTradeValue(avgPrice),
            demand: 'medium',
            sampleSize: reports.length,
            source: 'community_reports',
            lastUpdated: reports[0].timestamp
        };
    },
    
    /**
     * Parse price string to number (millions)
     */
    parsePriceString(priceStr) {
        const str = priceStr.toLowerCase();
        
        // Match patterns like "100M", "1.5B", "500k"
        const match = str.match(/([\d.]+)\s*(m|b|k|million|billion|thousand)?/i);
        
        if (!match) return 0;
        
        const num = parseFloat(match[1]);
        const unit = match[2];
        
        if (!unit || unit.startsWith('m')) return num; // Millions
        if (unit.startsWith('b')) return num * 1000; // Billions
        if (unit.startsWith('k') || unit.startsWith('t')) return num / 1000; // Thousands
        
        return num;
    },
    
    /**
     * Format price number
     */
    formatPrice(millions) {
        if (millions >= 1000) {
            return `${(millions / 1000).toFixed(1)}B`;
        }
        return `${millions.toFixed(0)}M`;
    },
    
    /**
     * Convert price to trade value tier
     */
    priceToTradeValue(millions) {
        if (millions >= 500) return 'Extremely High';
        if (millions >= 200) return 'Very High';
        if (millions >= 100) return 'High';
        if (millions >= 50) return 'Medium-High';
        if (millions >= 20) return 'Medium';
        if (millions >= 10) return 'Low-Medium';
        return 'Low';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LivePricing, BackendPricing, CommunityPricing };
}
