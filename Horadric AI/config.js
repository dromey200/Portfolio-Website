// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 1.2.0 (Aggressive Reality Check)
// ====================================

const CONFIG = {
    // D4 CLASS DATABASE
    CLASS_DEFINITIONS: {
        'd4': {
            'Barbarian': { builds: ['Whirlwind', 'HOTA', 'Thorns'], mechanics: ['Berserking', 'Bleed'] },
            'Druid': { builds: ['Pulverize', 'Stormclaw', 'Tornado'], mechanics: ['Fortify', 'Overpower'] },
            'Necromancer': { builds: ['Bone Spear', 'Minion', 'Blood'], mechanics: ['Essence', 'Corpse'] },
            'Paladin': { builds: ['Shield Bash', 'Holy Fire'], mechanics: ['Block', 'Thorns'] },
            'Rogue': { builds: ['Twisting Blades', 'Rapid Fire'], mechanics: ['Lucky Hit', 'Crit'] },
            'Sorcerer': { builds: ['Ice Shards', 'Firewall', 'Ball Lightning'], mechanics: ['Mana', 'Barrier'] },
            'Spiritborn': { builds: ['Jaguar', 'Eagle', 'Centipede'], mechanics: ['Vigor', 'Dodge'] }
        }
    }
};

const PROMPT_TEMPLATES = {
    /**
     * STAGE 1: THE SENTRY
     * Strictly separates D4 Loot vs. Real World
     */
    detect: () => `
    ROLE: Computer Vision Classifier.
    TASK: Determine if the image is a valid Diablo IV screenshot.
    
    CATEGORIES:
    1. "d4" -> Valid Diablo 4 Loot Tooltip.
       - MUST contain text like: "Item Power", "Ancestral", "Sacred", "Account Bound".
       - Visuals: Dark UI, serif fonts, stat lists.
       
    2. "not_loot" -> ANYTHING ELSE.
       - Real World Objects: Cans, Bottles (Bubly/Pepsi), Keyboards, Hands, Desks.
       - Photos of Screens: If the image is tilted, has glare, or shows a monitor bezel -> "not_loot".
       - Other Games: Diablo 2 (Pixelated), Diablo 3 (Cartoonish), WoW, PoE.

    CRITICAL RULES:
    - If you see a beverage can (e.g. Bubly), IMMEDIATELY return "not_loot".
    - If you see a physical jacket or clothing item, return "not_loot".
    - If you cannot read specific RPG stats (Str, Int, Dmg), return "not_loot".

    OUTPUT FORMAT (JSON ONLY):
    {"category": "d4" | "not_loot", "reason": "short explanation"}
    `,

    /**
     * STAGE 2: THE APPRAISER
     */
    analyze: (playerClass, buildStyle) => `
        ROLE: Expert Diablo IV Theorycrafter.
        TASK: Analyze this item for a ${playerClass} (${buildStyle}).
        
        OUTPUT FORMAT (JSON Only):
        {
            "title": "Item Name",
            "type": "Item Type",
            "rarity": "Rarity",
            "score": "S/A/B/C/D Tier",
            "verdict": "KEEP or SALVAGE",
            "insight": "1 sentence summary.",
            "analysis": "Markdown stats analysis."
        }
    `
};