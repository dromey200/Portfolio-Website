// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 9.7.0 (Corrected Class Database)
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

    analyze: (playerClass, buildStyle, settings) => {
        let contextLayer = `Game: Diablo IV (Season 11). Class: ${playerClass}. Build: ${buildStyle || 'General'}.`;
        
        if (settings?.mechanic) contextLayer += ` Focus Mechanic: ${settings.mechanic}.`;
        
        if (settings?.needs) {
            const activeNeeds = Object.entries(settings.needs)
                .filter(([_, active]) => active)
                .map(([stat]) => stat.toUpperCase())
                .join(', ');
            if (activeNeeds) contextLayer += ` User specifically needs: ${activeNeeds}.`;
        }

        return `
        ROLE: Expert Diablo IV Theorycrafter (Season 11).
        CONTEXT: ${contextLayer}
        TASK:
        1. OCR the item name, power, and affixes from the image.
        2. Analyze quality based on the provided Class/Build context.
        3. Check for "Sanctified" or "Ancestral" status.
        4. Determine if it is a "God Roll" (KEEP) or trash (SALVAGE).
        
        OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN):
        {
            "title": "Full Item Name",
            "type": "Slot (e.g. Helm, Sword)",
            "rarity": "Ancestral Legendary / Unique",
            "verdict": "KEEP or SALVAGE",
            "score": "S/A/B/C/D Tier",
            "insight": "One concise sentence explaining why it fits or fails the specific build.",
            "analysis": "Markdown formatted table listing Affixes vs Ideal Affixes. Use bold for good stats.",
            "trade_query": "Exact Item Name"
        }
        `;
    }
};

if (typeof module !== 'undefined') module.exports = { CONFIG, PROMPT_TEMPLATES };