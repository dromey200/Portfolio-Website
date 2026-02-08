// ====================================
// HORADRIC AI - GUIDED TOUR SYSTEM
// Version: 3.0.0 (Updated for Analyze/Compare + Journal)
// ====================================

const TourGuide = {
    currentStep: 0,
    isActive: false,
    
    steps: [
        {
            title: "Welcome to Horadric AI! 🎮",
            description: "Let's walk through how to analyze your Diablo 4 loot using AI. This will only take a minute.",
            target: null,
            position: "center"
        },
        {
            title: "Step 1: Get Your Free API Key 🔑",
            description: "First, you need a free Google Gemini API key. Click 'Get API Key →' to grab one from Google AI Studio, then paste it here. It takes under 2 minutes and costs nothing.",
            target: "#api-key-group",
            position: "bottom"
        },
        {
            title: "Step 2: Select Your Class ⚔️",
            description: "Pick your character class. This lets the AI tailor its analysis to stats that actually matter for your class. Leave it blank for a general breakdown.",
            target: "#class-group",
            position: "bottom"
        },
        {
            title: "Step 3: Choose Your Build 🎯",
            description: "Once you select a class, build-specific options appear here. Selecting a build gives you the most targeted advice — the AI will evaluate every affix for your exact playstyle.",
            target: "#build-group",
            position: "bottom"
        },
        {
            title: "Analyze or Compare ⚖️",
            description: "Two modes: Analyze evaluates a single item. Compare reads two items from one screenshot and tells you which to equip and which to salvage.",
            target: ".mode-toggle",
            position: "bottom"
        },
        {
            title: "Upload Your Screenshot 📸",
            description: "Upload a screenshot of your item tooltip. For Compare mode, upload a single image showing both items side by side. Supports PNG, JPEG, and WebP.",
            target: "#upload-group",
            position: "bottom"
        },
        {
            title: "Try Demo Mode First! 🎮",
            description: "No API key yet? Hit Demo Mode to see a sample analysis with a Mythic Unique Shako. Works in both Analyze and Compare modes.",
            target: "#demo-btn",
            position: "top"
        },
        {
            title: "Your Scan Journal 📜",
            description: "Every scan is saved here. Click any entry to expand the full insight, affixes, and verdict. Your journal persists across sessions so you can always review past scans.",
            target: "#journal-sidebar",
            position: "left"
        },
        {
            title: "You're Ready, Nephalem! 🚀",
            description: "Get your API key, pick your class and build, upload an item, and let Horadric AI do the rest. Happy hunting!",
            target: null,
            position: "center"
        }
    ],
    
    init() {
        this.injectStyles();
        this.createOverlay();
        this.attachEventListeners();
        this.checkFirstVisit();
    },
    
    checkFirstVisit() {
        const hasSeenTour = localStorage.getItem('horadric_tour_completed');
        if (!hasSeenTour) {
            setTimeout(() => this.start(), 1000);
        }
    },
    
    // ====================================
    // STYLES — Injected so tour.js is self-contained
    // ====================================
    injectStyles() {
        if (document.getElementById('tour-styles')) return;
        const style = document.createElement('style');
        style.id = 'tour-styles';
        style.textContent = `
            /* Backdrop: semi-transparent dark overlay */
            .tour-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                z-index: 9998;
                transition: opacity 0.3s ease;
            }

            /* Highlighted element gets lifted above the backdrop */
            .tour-highlight {
                position: relative !important;
                z-index: 9999 !important;
                box-shadow: 
                    0 0 0 4px #d4af37,
                    0 0 0 8px rgba(212, 175, 55, 0.3),
                    0 0 30px rgba(212, 175, 55, 0.2) !important;
                border-radius: 8px !important;
                transition: box-shadow 0.3s ease;
            }

            /* Pulsing ring animation on the highlighted element */
            .tour-highlight::after {
                content: '';
                position: absolute;
                inset: -12px;
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 12px;
                animation: tour-pulse 2s ease-in-out infinite;
                pointer-events: none;
                z-index: 9999;
            }

            @keyframes tour-pulse {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.01); }
            }

            /* Tooltip card */
            .tour-tooltip {
                position: fixed;
                z-index: 10000;
                background: #1a1a1a;
                border: 2px solid #d4af37;
                border-radius: 10px;
                padding: 0;
                width: 380px;
                max-width: calc(100vw - 40px);
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15);
                animation: tour-fadeIn 0.3s ease;
                font-family: inherit;
            }

            @keyframes tour-fadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tour-content {
                padding: 20px 22px 14px;
            }

            .tour-title {
                color: #d4af37;
                font-size: 1.05em;
                font-weight: bold;
                margin: 0 0 8px 0;
            }

            .tour-description {
                color: #ccc;
                font-size: 0.9em;
                line-height: 1.55;
                margin: 0;
            }

            /* Controls bar at bottom of tooltip */
            .tour-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 22px;
                border-top: 1px solid #2a2a2a;
                background: #141414;
                border-radius: 0 0 8px 8px;
            }

            .tour-btn {
                border: none;
                padding: 7px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.85em;
                font-weight: bold;
                transition: all 0.2s;
            }

            .tour-skip {
                background: transparent;
                color: #666;
                border: 1px solid #333;
            }
            .tour-skip:hover { color: #f44336; border-color: #f44336; }

            .tour-next {
                background: #d32f2f;
                color: #fff;
            }
            .tour-next:hover { background: #e53935; }

            .tour-step-counter {
                color: #555;
                font-size: 0.8em;
            }

            /* Progress dots */
            .tour-dots {
                display: flex;
                gap: 5px;
                align-items: center;
            }
            .tour-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #333;
                transition: all 0.3s;
            }
            .tour-dot.active { background: #d4af37; transform: scale(1.3); }
            .tour-dot.done { background: #666; }

            /* Hidden state */
            .tour-overlay-hidden .tour-backdrop,
            .tour-overlay-hidden .tour-tooltip {
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            /* Arrow pointer from tooltip toward target */
            .tour-arrow {
                position: absolute;
                width: 14px;
                height: 14px;
                background: #1a1a1a;
                border: 2px solid #d4af37;
                transform: rotate(45deg);
                z-index: -1;
            }
            .tour-arrow-top { top: -9px; left: calc(50% - 7px); border-bottom: none; border-right: none; }
            .tour-arrow-bottom { bottom: -9px; left: calc(50% - 7px); border-top: none; border-left: none; }
            .tour-arrow-left { left: -9px; top: calc(50% - 7px); border-top: none; border-right: none; }
            .tour-arrow-right { right: -9px; top: calc(50% - 7px); border-bottom: none; border-left: none; }

            /* Mobile responsive */
            @media (max-width: 600px) {
                .tour-tooltip {
                    width: calc(100vw - 30px);
                    left: 15px !important;
                    right: 15px !important;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // ====================================
    // OVERLAY CREATION
    // ====================================
    createOverlay() {
        if (document.getElementById('tour-backdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'tour-backdrop';
        backdrop.className = 'tour-backdrop';
        backdrop.style.display = 'none';
        document.body.appendChild(backdrop);

        const tooltip = document.createElement('div');
        tooltip.id = 'tour-tooltip';
        tooltip.className = 'tour-tooltip';
        tooltip.style.display = 'none';
        
        // Build dots HTML
        const dotsHTML = this.steps.map((_, i) => `<span class="tour-dot" data-step="${i}"></span>`).join('');

        tooltip.innerHTML = `
            <div class="tour-arrow" id="tour-arrow"></div>
            <div class="tour-content">
                <h3 class="tour-title" id="tour-title"></h3>
                <p class="tour-description" id="tour-description"></p>
            </div>
            <div class="tour-controls">
                <button id="tour-skip" class="tour-btn tour-skip">Skip</button>
                <div class="tour-dots" id="tour-dots">${dotsHTML}</div>
                <button id="tour-next" class="tour-btn tour-next">Next</button>
            </div>
        `;
        document.body.appendChild(tooltip);
    },

    // ====================================
    // EVENT LISTENERS
    // ====================================
    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tour-skip') this.skip();
            if (e.target.id === 'tour-next') this.next();
            if (e.target.id === 'tour-backdrop') this.skip();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            if (e.key === 'Escape') this.skip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') this.next();
            if (e.key === 'ArrowLeft') this.prev();
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            if (!this.isActive) return;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.positionTooltip(this.steps[this.currentStep]), 200);
        });
    },

    // ====================================
    // TOUR CONTROL
    // ====================================
    start() {
        this.currentStep = 0;
        this.isActive = true;
        document.getElementById('tour-backdrop').style.display = 'block';
        document.getElementById('tour-tooltip').style.display = 'block';
        this.showStep(0);

        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_started', { timestamp: new Date().toISOString() });
        }
    },

    next() {
        if (this.currentStep >= this.steps.length - 1) {
            this.complete();
        } else {
            this.showStep(this.currentStep + 1);
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    },

    skip() {
        this.end();
        localStorage.setItem('horadric_tour_completed', 'true');
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_skipped', { step: this.currentStep + 1, total_steps: this.steps.length });
        }
    },

    complete() {
        this.end();
        localStorage.setItem('horadric_tour_completed', 'true');
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_completed', { timestamp: new Date().toISOString() });
        }
    },

    end() {
        this.isActive = false;
        document.getElementById('tour-backdrop').style.display = 'none';
        document.getElementById('tour-tooltip').style.display = 'none';
        this.clearHighlight();
    },

    restart() {
        localStorage.removeItem('horadric_tour_completed');
        // Close help modal if open
        const helpModal = document.getElementById('help-modal');
        if (helpModal) helpModal.style.display = 'none';
        this.start();
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_restarted', { timestamp: new Date().toISOString() });
        }
    },

    // ====================================
    // STEP RENDERING
    // ====================================
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;

        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];

        // Update text
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-description').textContent = step.description;

        // Update button text
        const nextBtn = document.getElementById('tour-next');
        nextBtn.textContent = stepIndex === this.steps.length - 1 ? "Let's Go!" : 'Next →';

        // Update dots
        document.querySelectorAll('.tour-dot').forEach((dot, i) => {
            dot.className = 'tour-dot';
            if (i < stepIndex) dot.classList.add('done');
            if (i === stepIndex) dot.classList.add('active');
        });

        // Highlight target
        this.clearHighlight();

        if (step.target) {
            const el = document.querySelector(step.target);
            if (el) {
                el.classList.add('tour-highlight');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Position tooltip after a brief delay (let scroll settle)
        setTimeout(() => this.positionTooltip(step), 150);

        if (typeof Analytics !== 'undefined') {
            Analytics.trackUserJourneyStep(step.title, stepIndex + 1, this.steps.length);
        }
    },

    clearHighlight() {
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
    },

    // ====================================
    // TOOLTIP POSITIONING
    // ====================================
    positionTooltip(step) {
        const tooltip = document.getElementById('tour-tooltip');
        const arrow = document.getElementById('tour-arrow');
        const isMobile = window.innerWidth <= 600;

        // Reset inline styles
        tooltip.style.top = '';
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';
        tooltip.style.transform = '';
        arrow.className = 'tour-arrow';
        arrow.style.display = 'none';

        // Center position (no target)
        if (!step.target) {
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const target = document.querySelector(step.target);
        if (!target) {
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const rect = target.getBoundingClientRect();
        const tooltipW = tooltip.offsetWidth;
        const tooltipH = tooltip.offsetHeight;
        const pad = 16;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Mobile: always pin to bottom
        if (isMobile) {
            tooltip.style.bottom = '15px';
            tooltip.style.left = '15px';
            tooltip.style.right = '15px';
            tooltip.style.top = 'auto';
            tooltip.style.transform = 'none';
            arrow.style.display = 'none';
            return;
        }

        let top, left;

        if (step.position === 'bottom' && rect.bottom + pad + tooltipH < vh) {
            top = rect.bottom + pad;
            left = rect.left + rect.width / 2 - tooltipW / 2;
            arrow.className = 'tour-arrow tour-arrow-top';
            arrow.style.display = 'block';
        } else if (step.position === 'top' && rect.top - pad - tooltipH > 0) {
            top = rect.top - pad - tooltipH;
            left = rect.left + rect.width / 2 - tooltipW / 2;
            arrow.className = 'tour-arrow tour-arrow-bottom';
            arrow.style.display = 'block';
        } else if (step.position === 'left' && rect.left - pad - tooltipW > 0) {
            top = rect.top + rect.height / 2 - tooltipH / 2;
            left = rect.left - pad - tooltipW;
            arrow.className = 'tour-arrow tour-arrow-right';
            arrow.style.display = 'block';
        } else if (step.position === 'right' && rect.right + pad + tooltipW < vw) {
            top = rect.top + rect.height / 2 - tooltipH / 2;
            left = rect.right + pad;
            arrow.className = 'tour-arrow tour-arrow-left';
            arrow.style.display = 'block';
        } else {
            // Fallback: below target
            top = rect.bottom + pad;
            left = rect.left + rect.width / 2 - tooltipW / 2;
            arrow.className = 'tour-arrow tour-arrow-top';
            arrow.style.display = 'block';
        }

        // Clamp to viewport
        if (left < 10) left = 10;
        if (left + tooltipW > vw - 10) left = vw - tooltipW - 10;
        if (top < 10) top = 10;
        if (top + tooltipH > vh - 10) top = vh - tooltipH - 10;

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.transform = 'none';
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TourGuide.init());
} else {
    TourGuide.init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourGuide;
}