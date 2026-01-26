// ====================================
// HORADRIC AI - PRICING SYSTEM
// ====================================

/**
 * Price Database for Diablo 4 Items
 * Static database with community contribution support
 * Future: Integration with diablo.trade API
 */

const PriceDatabase = {
    // Last updated timestamp
    lastUpdated: '2026-01-16',
    
    // Price data structure
    items: {
        // ====================================
        // MYTHIC UNIQUES (Uber Uniques)
        // ====================================
        
        "The Grandfather": {
            rarity: "mythic",
            type: "Two-Handed Sword",
            tradeValue: "Extremely High",
            estimatedPrice: "500M+ Gold",
            demand: "very_high",
            notes: "Most prestigious weapon. Extremely rare drop.",
            bestFor: ["Barbarian"],
            searchTerms: ["grandfather", "mythic sword", "uber unique sword"]
        },
        
        "Harlequin Crest": {
            rarity: "mythic",
            type: "Helm",
            tradeValue: "Extremely High",
            estimatedPrice: "400M+ Gold",
            demand: "very_high",
            notes: "Best-in-slot helm for most builds. Universal BiS.",
            bestFor: ["All Classes"],
            searchTerms: ["shako", "harlequin", "mythic helm", "uber helm"]
        },
        
        "Tyrael's Might": {
            rarity: "mythic",
            type: "Chest Armor",
            tradeValue: "Extremely High",
            estimatedPrice: "350M+ Gold",
            demand: "very_high",
            notes: "Top-tier defensive option. Great for melee builds.",
            bestFor: ["Barbarian", "Druid"],
            searchTerms: ["tyrael", "mythic chest", "uber chest"]
        },
        
        "Ahavarion, Spear of Lycander": {
            rarity: "mythic",
            type: "Staff",
            tradeValue: "Very High",
            estimatedPrice: "300M+ Gold",
            demand: "high",
            notes: "Powerful staff for casters. Enables unique builds.",
            bestFor: ["Sorcerer", "Spiritborn"],
            searchTerms: ["ahavarion", "lycander", "mythic staff", "uber staff"]
        },
        
        "Doombringer": {
            rarity: "mythic",
            type: "One-Handed Sword",
            tradeValue: "Very High",
            estimatedPrice: "280M+ Gold",
            demand: "high",
            notes: "Strong one-handed option for various builds.",
            bestFor: ["Barbarian", "Necromancer"],
            searchTerms: ["doombringer", "mythic sword", "uber 1h"]
        },
        
        "Melted Heart of Selig": {
            rarity: "mythic",
            type: "Amulet",
            tradeValue: "High",
            estimatedPrice: "250M+ Gold",
            demand: "medium",
            notes: "Unique defensive mechanics. Build-enabling.",
            bestFor: ["Sorcerer", "Necromancer"],
            searchTerms: ["melted heart", "selig", "mythic amulet", "uber amulet"]
        },
        
        // ====================================
        // TOP-TIER UNIQUE ITEMS
        // ====================================
        
        "Tibault's Will": {
            rarity: "unique",
            type: "Pants",
            tradeValue: "Very High",
            estimatedPrice: "100M-200M Gold",
            demand: "very_high",
            notes: "Best pants for many Rogue builds. Movement speed boost.",
            bestFor: ["Rogue"],
            searchTerms: ["tibault", "unique pants", "rogue pants"]
        },
        
        "Banished Lord's Talisman": {
            rarity: "unique",
            type: "Ring",
            tradeValue: "Very High",
            estimatedPrice: "80M-150M Gold",
            demand: "very_high",
            notes: "Essential for specific Necromancer builds.",
            bestFor: ["Necromancer"],
            searchTerms: ["banished lord", "unique ring", "necro ring"]
        },
        
        "Fists of Fate": {
            rarity: "unique",
            type: "Gloves",
            tradeValue: "High",
            estimatedPrice: "50M-100M Gold",
            demand: "high",
            notes: "Top gloves for lucky hit builds.",
            bestFor: ["Barbarian", "Druid"],
            searchTerms: ["fists of fate", "unique gloves"]
        },
        
        "Tuskhelm of Joritz the Mighty": {
            rarity: "unique",
            type: "Helm",
            tradeValue: "High",
            estimatedPrice: "60M-120M Gold",
            demand: "high",
            notes: "Strong defensive helm with thorns synergy.",
            bestFor: ["Barbarian"],
            searchTerms: ["tuskhelm", "joritz", "barb helm"]
        },
        
        "Ancients' Oath": {
            rarity: "unique",
            type: "Two-Handed Axe",
            tradeValue: "High",
            estimatedPrice: "70M-130M Gold",
            demand: "high",
            notes: "Powerful weapon for Whirlwind Barbarians.",
            bestFor: ["Barbarian"],
            searchTerms: ["ancients oath", "unique 2h axe", "barb axe"]
        },
        
        "Starless Skies": {
            rarity: "unique",
            type: "Chest Armor",
            tradeValue: "Medium-High",
            estimatedPrice: "40M-80M Gold",
            demand: "medium",
            notes: "Great for Spiritborn gorilla builds.",
            bestFor: ["Spiritborn"],
            searchTerms: ["starless skies", "spiritborn chest"]
        },
        
        "Flickerstep": {
            rarity: "unique",
            type: "Boots",
            tradeValue: "High",
            estimatedPrice: "50M-100M Gold",
            demand: "very_high",
            notes: "Best boots for Rogue. Amazing mobility.",
            bestFor: ["Rogue"],
            searchTerms: ["flickerstep", "unique boots", "rogue boots"]
        },
        
        "Rakanoth's Wake": {
            rarity: "unique",
            type: "Boots",
            tradeValue: "Medium",
            estimatedPrice: "30M-60M Gold",
            demand: "medium",
            notes: "Solid boots for movement-based builds.",
            bestFor: ["Rogue", "Spiritborn"],
            searchTerms: ["rakanoth", "unique boots"]
        },
        
        "Godslayer Crown": {
            rarity: "unique",
            type: "Helm",
            tradeValue: "High",
            estimatedPrice: "50M-90M Gold",
            demand: "high",
            notes: "Top helm for Druid werewolf builds.",
            bestFor: ["Druid"],
            searchTerms: ["godslayer", "druid helm"]
        },
        
        "Tempest Roar": {
            rarity: "unique",
            type: "Helm",
            tradeValue: "Very High",
            estimatedPrice: "80M-140M Gold",
            demand: "very_high",
            notes: "BiS for Hurricane Druid. Enables powerful builds.",
            bestFor: ["Druid"],
            searchTerms: ["tempest roar", "hurricane helm", "druid unique"]
        },
        
        "Earthstriker's Aspect": {
            rarity: "unique",
            type: "Gloves",
            tradeValue: "Medium",
            estimatedPrice: "25M-50M Gold",
            demand: "medium",
            notes: "Good for Landslide Druid builds.",
            bestFor: ["Druid"],
            searchTerms: ["earthstriker", "druid gloves"]
        },
        
        "Esu's Heirloom": {
            rarity: "unique",
            type: "Boots",
            tradeValue: "Very High",
            estimatedPrice: "90M-160M Gold",
            demand: "very_high",
            notes: "Best boots for Sorcerer. Essential for endgame.",
            bestFor: ["Sorcerer"],
            searchTerms: ["esu", "sorc boots", "sorcerer boots"]
        },
        
        "Cowl of the Nameless": {
            rarity: "unique",
            type: "Helm",
            tradeValue: "High",
            estimatedPrice: "60M-110M Gold",
            demand: "high",
            notes: "Strong helm for Necromancer builds.",
            bestFor: ["Necromancer"],
            searchTerms: ["cowl nameless", "necro helm"]
        },
        
        "Blood Artisan's Cuirass": {
            rarity: "unique",
            type: "Chest Armor",
            tradeValue: "High",
            estimatedPrice: "55M-100M Gold",
            demand: "high",
            notes: "Top chest for blood skill Necromancers.",
            bestFor: ["Necromancer"],
            searchTerms: ["blood artisan", "necro chest"]
        },
        
        "Writhing Band of Trickery": {
            rarity: "unique",
            type: "Ring",
            tradeValue: "Medium-High",
            estimatedPrice: "40M-75M Gold",
            demand: "medium",
            notes: "Useful ring for subterfuge builds.",
            bestFor: ["Rogue"],
            searchTerms: ["writhing band", "trickery ring", "rogue ring"]
        },
        
        "Scoundrel's Leathers": {
            rarity: "unique",
            type: "Chest Armor",
            tradeValue: "Medium",
            estimatedPrice: "30M-65M Gold",
            demand: "medium",
            notes: "Decent chest option for Rogue.",
            bestFor: ["Rogue"],
            searchTerms: ["scoundrel", "rogue chest"]
        },
        
        // ====================================
        // LEGENDARY ITEMS (High Demand)
        // ====================================
        
        "Legendary Helm with Shout Skills +4": {
            rarity: "legendary",
            type: "Helm",
            tradeValue: "High",
            estimatedPrice: "20M-40M Gold",
            demand: "high",
            notes: "Perfect roll shout helm for Barbarian.",
            bestFor: ["Barbarian"],
            searchTerms: ["shout helm", "barb helm +4"]
        },
        
        "Legendary Gloves with Critical Strike": {
            rarity: "legendary",
            type: "Gloves",
            tradeValue: "Medium-High",
            estimatedPrice: "15M-35M Gold",
            demand: "high",
            notes: "Well-rolled crit gloves. Universal value.",
            bestFor: ["All Classes"],
            searchTerms: ["crit gloves", "critical strike gloves"]
        },
        
        "Legendary Boots with Movement Speed": {
            rarity: "legendary",
            type: "Boots",
            tradeValue: "Medium",
            estimatedPrice: "10M-25M Gold",
            demand: "high",
            notes: "High movement speed with good secondary stats.",
            bestFor: ["All Classes"],
            searchTerms: ["movement boots", "speed boots"]
        },
        
        "Legendary Chest with Damage Reduction": {
            rarity: "legendary",
            type: "Chest Armor",
            tradeValue: "Medium",
            estimatedPrice: "12M-28M Gold",
            demand: "medium",
            notes: "High damage reduction with good rolls.",
            bestFor: ["All Classes"],
            searchTerms: ["dr chest", "damage reduction chest"]
        },
        
        "Legendary Amulet with Cooldown Reduction": {
            rarity: "legendary",
            type: "Amulet",
            tradeValue: "High",
            estimatedPrice: "25M-50M Gold",
            demand: "high",
            notes: "High CDR with crit damage. Very sought after.",
            bestFor: ["All Classes"],
            searchTerms: ["cdr amulet", "cooldown amulet"]
        },
        
        "Legendary Ring with Vulnerable Damage": {
            rarity: "legendary",
            type: "Ring",
            tradeValue: "Medium-High",
            estimatedPrice: "18M-38M Gold",
            demand: "high",
            notes: "High vulnerable damage. Meta stat.",
            bestFor: ["All Classes"],
            searchTerms: ["vulnerable ring", "vuln damage ring"]
        },
        
        // ====================================
        // POPULAR UNIQUE WEAPONS
        // ====================================
        
        "Windforce": {
            rarity: "unique",
            type: "Bow",
            tradeValue: "Medium",
            estimatedPrice: "30M-60M Gold",
            demand: "medium",
            notes: "Classic Diablo bow. Good for certain Rogue builds.",
            bestFor: ["Rogue"],
            searchTerms: ["windforce", "unique bow"]
        },
        
        "Azurewrath": {
            rarity: "unique",
            type: "One-Handed Sword",
            tradeValue: "Low-Medium",
            estimatedPrice: "10M-25M Gold",
            demand: "low",
            notes: "Situational weapon. Limited use cases.",
            bestFor: ["Barbarian"],
            searchTerms: ["azurewrath", "unique sword"]
        },
        
        "The Oculus": {
            rarity: "unique",
            type: "Wand",
            tradeValue: "Medium",
            estimatedPrice: "20M-45M Gold",
            demand: "medium",
            notes: "Classic Sorcerer wand. Decent option.",
            bestFor: ["Sorcerer"],
            searchTerms: ["oculus", "unique wand"]
        },
        
        "Skyhunter": {
            rarity: "unique",
            type: "Bow",
            tradeValue: "Medium",
            estimatedPrice: "25M-50M Gold",
            demand: "medium",
            notes: "Strong bow for penetrating shot builds.",
            bestFor: ["Rogue"],
            searchTerms: ["skyhunter", "unique bow"]
        },
        
        "Staff of Endless Rage": {
            rarity: "unique",
            type: "Staff",
            tradeValue: "Low-Medium",
            estimatedPrice: "15M-30M Gold",
            demand: "low",
            notes: "Niche staff. Limited build options.",
            bestFor: ["Druid"],
            searchTerms: ["endless rage", "unique staff"]
        }
    },
    
    /**
     * Search for item price data
     */
    searchItem(itemName) {
        if (!itemName) return null;
        
        const searchLower = itemName.toLowerCase().trim();
        
        // Direct match
        for (const [name, data] of Object.entries(this.items)) {
            if (name.toLowerCase() === searchLower) {
                return { name, ...data };
            }
        }
        
        // Fuzzy search by search terms
        for (const [name, data] of Object.entries(this.items)) {
            if (data.searchTerms && data.searchTerms.some(term => 
                term.includes(searchLower) || searchLower.includes(term)
            )) {
                return { name, ...data };
            }
        }
        
        // Partial name match
        for (const [name, data] of Object.entries(this.items)) {
            if (name.toLowerCase().includes(searchLower) || 
                searchLower.includes(name.toLowerCase().split(' ')[0])) {
                return { name, ...data };
            }
        }
        
        return null;
    },
    
    /**
     * Get items by rarity
     */
    getItemsByRarity(rarity) {
        return Object.entries(this.items)
            .filter(([_, data]) => data.rarity === rarity)
            .map(([name, data]) => ({ name, ...data }));
    },
    
    /**
     * Get items by class
     */
    getItemsByClass(className) {
        return Object.entries(this.items)
            .filter(([_, data]) => data.bestFor && data.bestFor.includes(className))
            .map(([name, data]) => ({ name, ...data }));
    },
    
    /**
     * Get demand level color
     */
    getDemandColor(demand) {
        const colors = {
            'very_high': 'var(--color-mythic)',
            'high': 'var(--color-legendary)',
            'medium': 'var(--color-rare)',
            'low': 'var(--color-magic)'
        };
        return colors[demand] || colors['medium'];
    },
    
    /**
     * Get demand label
     */
    getDemandLabel(demand) {
        const labels = {
            'very_high': 'Very High',
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        };
        return labels[demand] || 'Unknown';
    },
    
    /**
     * Get trade value tier
     */
    getValueTier(tradeValue) {
        if (tradeValue.includes('Extremely High')) return 'mythic';
        if (tradeValue.includes('Very High')) return 'unique';
        if (tradeValue.includes('High')) return 'legendary';
        if (tradeValue.includes('Medium')) return 'rare';
        return 'common';
    }
};

// ====================================
// CROWDSOURCED PRICING MODULE
// ====================================

const CrowdsourcedPricing = {
    // Local storage key
    storageKey: 'horadric_price_reports',
    
    /**
     * Submit price report
     */
    submitReport(itemName, observedPrice, source, notes) {
        const report = {
            id: Date.now(),
            itemName: itemName,
            observedPrice: observedPrice,
            source: source,
            notes: notes || '',
            timestamp: new Date().toISOString(),
            submitted: false
        };
        
        // Store locally
        const reports = this.getReports();
        reports.push(report);
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(reports));
        } catch (e) {
            console.warn('Failed to save price report:', e);
        }
        
        // Track with analytics
        if (typeof Analytics !== 'undefined') {
            Analytics.trackPriceReported(itemName, observedPrice, source);
        }
        
        // In future: Send to backend API
        // this.sendToBackend(report);
        
        return report;
    },
    
    /**
     * Get all reports
     */
    getReports() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to load price reports:', e);
            return [];
        }
    },
    
    /**
     * Get reports for specific item
     */
    getReportsForItem(itemName) {
        return this.getReports().filter(r => 
            r.itemName.toLowerCase() === itemName.toLowerCase()
        );
    },
    
    /**
     * Clear all reports
     */
    clearReports() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.warn('Failed to clear reports:', e);
        }
    },
    
    /**
     * Future: Send to backend
     */
    async sendToBackend(report) {
        // TODO: Implement backend submission
        // const response = await fetch('/api/price-reports', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(report)
        // });
        // return response.json();
    }
};

// ====================================
// DIABLO.TRADE INTEGRATION (Future)
// ====================================

const DiabloTradeAPI = {
    baseUrl: 'https://diablo.trade',
    
    /**
     * Generate search URL for item
     */
    getSearchUrl(itemName) {
        const encoded = encodeURIComponent(itemName);
        return `${this.baseUrl}/listings/items?search=${encoded}`;
    },
    
    /**
     * Future: Fetch live prices from API
     */
    async fetchLivePrice(itemName) {
        // TODO: Implement when diablo.trade provides public API
        // const response = await fetch(`${this.baseUrl}/api/items/${itemName}`);
        // return response.json();
        
        console.log('Live price fetching not yet implemented');
        return null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PriceDatabase, CrowdsourcedPricing, DiabloTradeAPI };
}
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
            avgPrice: this.formatPrice(avgPrice),
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
            return `${(millions / 1000).toFixed(1)}B Gold`;
        }
        if (millions >= 1) {
            return `${millions.toFixed(0)}M Gold`;
        }
        return `${(millions * 1000).toFixed(0)}K Gold`;
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
