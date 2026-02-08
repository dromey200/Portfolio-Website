// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 10.0.0 (Analyze + Compare Modes)
// ====================================

const CONFIG = {
    // System Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    
    // VISUAL SIGNATURES
    GAME_SIGNATURES: {
        'd4': {
            name: 'Diablo IV',
            visual_cues: 'Dark/Gritty UI, "Item Power", "Sanctified" label, "Ancestral" text.',
            anchors: ['Item Power', 'Ancestral', 'Sacred', 'Sanctified', 'Aspect', 'Lucky Hit', 'Vulnerable Damage', 'Account Bound']
        },
        'd2r': { name: 'Diablo II', anchors: ['Defense', 'Durability', 'Required Level', 'Fingerprint'] },
        'd3': { name: 'Diablo III', anchors: ['Primary', 'Secondary', 'Augmented', 'Ancient'] },
        'di': { name: 'Diablo Immortal', anchors: ['Combat Rating', 'Score', 'Resonance'] }
    },

    // D4 CLASS DATABASE (With Full Paladin Spec)
    CLASS_DEFINITIONS: {
        'd4': {
            'Barbarian': { builds: ['Whirlwind Dust Devils', 'HOTA', 'Bash Cleave', 'Thorns', 'Double Swing'], mechanics: ['Berserking', 'Overpower', 'Bleed'] },
            'Druid': { builds: ['Wind Shear', 'Werewolf Tornado', 'Pulverize', 'Landslide Storm', 'Companion'], mechanics: ['Spirit Boons', 'Shapeshifting', 'Fortify'] },
            'Necromancer': { builds: ['Bone Spirit', 'Minion Master', 'Blood Surge', 'Shadowblight', 'Sever'], mechanics: ['Book of the Dead', 'Corpse Consumption', 'Curses'] },
            'Paladin': { builds: ['Juggernaut', 'Zealot', 'Judicator', 'Disciple'], mechanics: ['Block Chance', 'Holy Damage', 'Auras'] },
            'Rogue': { builds: ['Heartseeker', 'Twisting Blades', 'Rapid Fire', 'Barrage', 'Penetrating Shot'], mechanics: ['Combo Points', 'Imbuements', 'Vulnerable'] },
            'Sorcerer': { builds: ['Frozen Orb', 'Incinerate', 'Ball Lightning', 'Firewall', 'Ice Shards'], mechanics: ['Enchantments', 'Barrier', 'Burning'] },
            'Spiritborn': { builds: ['Jaguar Rush', 'Eagle Evade', 'Centipede Poison', 'Gorilla Slam'], mechanics: ['Vigor', 'Resolve', 'Ferocity'] }
        }
    }
};

const PROMPT_TEMPLATES = {
    // ---- STAGE 1: Detect if image is a valid game item ----
    detect: () => `
    TASK: Analyze the image and identify if it is a loot tooltip from a known ARPG.
    CRITERIA:
    1. Look for keywords: "Item Power", "Damage per Second", "Armor", "Affixes".
    2. Ignore real-world photos or non-gaming screenshots.
    OUTPUT FORMAT (STRICT JSON, NO PREAMBLE):
    {
        "game": "d4",
        "category": "d4", 
        "confidence": 0.99
    }
    OR if not a game item:
    {
        "game": "unknown",
        "category": "not_loot"
    }
    `,

    // ---- ANALYZE MODE: Single item deep analysis ----
    analyze: (playerClass, buildStyle, settings) => {
        const hasClass = playerClass && playerClass !== 'Any';
        const hasBuild = buildStyle && buildStyle !== '' && buildStyle !== 'General';
        
        let contextLayer = 'Game: Diablo IV (Season 11).';
        if (hasClass) contextLayer += ` Class: ${playerClass}.`;
        if (hasBuild) contextLayer += ` Build: ${buildStyle}.`;
        
        if (settings?.mechanic) contextLayer += ` Focus Mechanic: ${settings.mechanic}.`;
        
        if (settings?.needs) {
            const activeNeeds = Object.entries(settings.needs)
                .filter(([_, active]) => active)
                .map(([stat]) => stat.toUpperCase())
                .join(', ');
            if (activeNeeds) contextLayer += ` User specifically needs: ${activeNeeds}.`;
        }

        let analysisInstructions;
        if (hasClass && hasBuild) {
            analysisInstructions = `Evaluate how each affix synergizes with the ${playerClass} ${buildStyle} build. Explain which affixes are strong or weak specifically for this build and why. Rate the item for this exact build.`;
        } else if (hasClass) {
            analysisInstructions = `Evaluate the item for the ${playerClass} class in general. Note which affixes benefit the class and which do not. Rate the item based on general ${playerClass} viability.`;
        } else {
            analysisInstructions = `Evaluate the item on its own merits based solely on what is visible in the screenshot. Assess affix quality, roll ranges, item power, and rarity. Provide a general rating without class-specific assumptions.`;
        }

        return `
        ROLE: Expert Diablo IV Theorycrafter (Season 11).
        CONTEXT: ${contextLayer}
        
        TASK:
        1. OCR the item name, item power, and all affixes from the image.
        2. ${analysisInstructions}
        3. Check for "Sanctified", "Ancestral", or "Mythic Unique" status.
        4. Determine verdict: KEEP (strong item) or SALVAGE (weak/bad rolls).
        
        OUTPUT FORMAT (STRICT JSON ONLY):
        {
            "title": "Full Item Name",
            "type": "Slot (e.g. Helm, Sword, Amulet)",
            "rarity": "Ancestral Legendary / Unique / Mythic Unique",
            "item_power": "Number if visible",
            "verdict": "KEEP or SALVAGE",
            "score": "S/A/B/C/D Tier",
            "insight": "2-3 sentences explaining the verdict. Reference specific affixes and how they interact with the class/build if provided, or general quality if not.",
            "affixes": [
                { "name": "Affix Name", "value": "Roll Value", "quality": "GOOD or BAD or OK", "reason": "Brief explanation" }
            ],
            "trade_query": "Exact Item Name"
        }
        
        IMPORTANT: The "affixes" field must be an array of objects. The "quality" field must be exactly "GOOD", "BAD", or "OK". The "reason" field should be 1 short sentence.
        `;
    },

    // ---- COMPARE MODE: Two items head-to-head ----
    compare: (playerClass, buildStyle, settings) => {
        const hasClass = playerClass && playerClass !== 'Any';
        const hasBuild = buildStyle && buildStyle !== '' && buildStyle !== 'General';
        
        let contextLayer = 'Game: Diablo IV (Season 11).';
        if (hasClass) contextLayer += ` Class: ${playerClass}.`;
        if (hasBuild) contextLayer += ` Build: ${buildStyle}.`;
        
        if (settings?.mechanic) contextLayer += ` Focus Mechanic: ${settings.mechanic}.`;
        
        if (settings?.needs) {
            const activeNeeds = Object.entries(settings.needs)
                .filter(([_, active]) => active)
                .map(([stat]) => stat.toUpperCase())
                .join(', ');
            if (activeNeeds) contextLayer += ` User specifically needs: ${activeNeeds}.`;
        }

        let comparisonInstructions;
        if (hasClass && hasBuild) {
            comparisonInstructions = `Compare both items specifically for the ${playerClass} ${buildStyle} build. Determine which item provides better synergy, damage, survivability, and overall value for this exact build.`;
        } else if (hasClass) {
            comparisonInstructions = `Compare both items for the ${playerClass} class in general. Determine which item is stronger for typical ${playerClass} builds.`;
        } else {
            comparisonInstructions = `Compare both items based solely on their visible stats. Evaluate item power, affix quality, roll ranges, and rarity. Determine which is the stronger item in general without class-specific assumptions.`;
        }

        return `
        ROLE: Expert Diablo IV Theorycrafter (Season 11).
        CONTEXT: ${contextLayer}
        
        TASK: The image contains TWO item tooltips visible in a single screenshot (side by side, stacked, or overlapping).
        1. OCR both items from the image: name, item power, all affixes for each.
        2. ${comparisonInstructions}
        3. Declare a winner and explain why.
        
        OUTPUT FORMAT (STRICT JSON ONLY):
        {
            "item_1": {
                "title": "Full Item Name",
                "type": "Slot",
                "rarity": "Rarity tier",
                "item_power": "Number if visible",
                "affixes": [
                    { "name": "Affix Name", "value": "Roll Value", "quality": "GOOD or BAD or OK", "reason": "Brief explanation" }
                ]
            },
            "item_2": {
                "title": "Full Item Name",
                "type": "Slot",
                "rarity": "Rarity tier",
                "item_power": "Number if visible",
                "affixes": [
                    { "name": "Affix Name", "value": "Roll Value", "quality": "GOOD or BAD or OK", "reason": "Brief explanation" }
                ]
            },
            "winner": "1 or 2",
            "verdict": "EQUIP ITEM 1 or EQUIP ITEM 2",
            "insight": "2-3 sentences explaining why the winning item is better. Reference specific affix differences and how they impact the class/build if provided, or general power if not.",
            "trade_query": "Exact name of the losing item (candidate for selling/salvaging)"
        }
        
        IMPORTANT: "winner" must be the string "1" or "2". Each "affixes" array must contain objects with "name", "value", "quality" (GOOD/BAD/OK), and "reason" fields.
        `;
    }
};

if (typeof module !== 'undefined') module.exports = { CONFIG, PROMPT_TEMPLATES };