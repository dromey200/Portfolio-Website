// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 2.0.2
// ====================================

const CONFIG = {
    // File Upload Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    
    // Image Compression
    COMPRESSION_QUALITY: 0.8,
    MAX_DIMENSION: 1024,
    
    // Diablo Item Rarities
    VALID_RARITIES: ['common', 'magic', 'rare', 'legendary', 'unique', 'mythic'],
    
    // History & Storage
    MAX_HISTORY: 10,
    
    // Response Parsing
    JSON_DELIMITER: '---METADATA---',
    
    // Cost Tracking
    SESSION_COST_KEY: 'horadric_session_cost',
    TOTAL_SCANS_KEY: 'horadric_total_scans',
    
    // Analytics
    GA_MEASUREMENT_ID: 'G-JFFL9DMHQX',
    
    // Feature Flags
    FEATURES: {
        priceChecker: true,
        costCalculator: true,
        demoMode: true,
        crowdsourcedPricing: true
    }
};

// ====================================
// AI PROVIDER CONFIGURATION (GEMINI ONLY)
// ====================================

const PROVIDERS = {
    gemini: {
        name: 'Google Gemini',
        description: 'Fast • Free tier available',
        keyPattern: /^AIza[a-zA-Z0-9_-]{35}$/,
        keyPlaceholder: 'AIzaSy...',
        getKeyUrl: 'https://aistudio.google.com/app/apikey',
        models: [
            {
                id: 'gemini-2.0-flash-exp',
                name: 'Gemini 2.0 Flash',
                recommended: true,
                costPer1kTokens: 0.00015,
                estimatedCostPerScan: 0.0008
            }
        ],
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
        demoItem: {
            name: 'Harlequin Crest (Shako)',
            rarity: 'unique',
            verdict: 'KEEP',
            imageUrl: 'harlequin_crest.jpg',
            analysis: `**Harlequin Crest (Shako)** (Unique Helm) 🎭 🏆

**(Unique Helm)**

**Score:**
God Roll (S-Tier) 🚀

**Verdict:**
KEEP! This is one of the most sought-after items in the game.

**Key Stats:**
• +Maximum Life • +All Stats • +Cooldown Reduction • +Resource Generation

**Why It's Valuable:**
The Shako is universally good for all classes. Its combination of defensive stats and utility makes it a best-in-slot item for virtually every build. This helm dramatically increases your survivability while boosting damage output.

**Trade Value:**
Extremely High - Worth multiple high-value items or significant trading power`
        },
        help: {
            title: 'Get Google Gemini API Key',
            steps: [
                'Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>',
                'Sign in with your Google account',
                'Click "Create API Key"',
                'Select "Create key in new project"',
                'Copy the key starting with <code>AIza...</code>',
                'Paste it into the API Key field above'
            ],
            note: 'Free tier includes generous usage limits (~15 requests/minute, 1500/day)'
        }
    }
};

// ====================================
// PROMPT TEMPLATES
// ====================================

const PROMPT_TEMPLATES = {
    base: (playerClass, buildStyle) => {
        // Build context string
        let buildContext = '';
        if (buildStyle) {
            const buildDescriptions = {
                'damage': 'focuses on maximizing raw damage output',
                'tanky': 'prioritizes survivability and damage reduction',
                'speed': 'values mobility, movement speed, and quick gameplay',
                'dots': 'specializes in damage-over-time effects and bleed/burn/poison',
                'crit': 'builds around critical strike chance and critical damage',
                'minions': 'relies on summoned minions/pets for damage',
                'cooldown': 'focuses on cooldown reduction to spam abilities',
                'lucky-hit': 'leverages lucky hit chance for proc-based effects',
                'crowd-control': 'emphasizes freezing, stunning, and controlling enemies',
                'resource': 'prioritizes resource generation and sustain'
            };
            
            buildContext = buildDescriptions[buildStyle] 
                ? ` Their build ${buildDescriptions[buildStyle]}.`
                : '';
        }
        
        return `Role: Expert Diablo 4 Item Analyst
Context: Player class is ${playerClass}.${buildContext}
Task: Analyze the item in this screenshot and provide detailed evaluation.

CRITICAL FORMAT REQUIREMENTS:
Use EXACTLY this structure with NO extra blank lines:

**[Item Name]** ([Item Type]) [Emojis]

**(Rarity Level)**

**Score:**
[Rating] [Emoji]

**Verdict:**
[KEEP or SALVAGE]! [One sentence why]

**Key Stats:**
• [Stat 1] • [Stat 2] • [Stat 3] • [Stat 4]

**Why It's Valuable:**
[2-3 sentences explaining value, synergies, and build fit for ${playerClass}${buildStyle ? ` (${buildStyle} build)` : ''}]

**Trade Value:**
[Trade value assessment with brief explanation]

FORMATTING RULES:
- Use **bold** for all section headers
- Put content IMMEDIATELY after section headers (no blank line)
- Only ONE blank line between sections
- Use bullet points (•) for stats list, separate with spaces
- Keep descriptions concise (2-3 sentences max per section)
- Use relevant emojis sparingly
- Verdict format MUST be: "KEEP!" or "SALVAGE!" followed by explanation
- ${buildStyle ? `PRIORITIZE stats that synergize with ${buildStyle} builds` : 'Consider general build versatility'}
- End with: ${CONFIG.JSON_DELIMITER}
{"rarity":"[rarity]","trade_query":"[item name]"}

Valid rarities: ${CONFIG.VALID_RARITIES.join(', ')}

Focus on ${playerClass} builds${buildStyle ? ` with ${buildStyle} playstyle` : ' and current meta relevance'}.`;
    },

    detailed: (playerClass) => `Role: Master Diablo 4 Theorycrafting Expert
Context: Player class is ${playerClass}
Task: Provide comprehensive item analysis with build recommendations.

Deep Analysis Required:
1. Item identification and stat breakdown
2. Synergy with ${playerClass} builds
3. Comparison with other items in slot
4. Current meta relevance
5. Trade value assessment
6. Alternative uses for other classes

Be thorough and educational. Help the player understand WHY an item is good or bad.

Output Format:
- Item name in **bold**
- Detailed stat analysis
- Build recommendations
- Trade value explanation
- End with: ${CONFIG.JSON_DELIMITER}
{"rarity":"rarity_here","trade_query":"search_query_here"}

Valid rarities: ${CONFIG.VALID_RARITIES.join(', ')}`
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, PROVIDERS, PROMPT_TEMPLATES };
}
