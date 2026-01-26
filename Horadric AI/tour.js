// ====================================
// HORADRIC AI - GUIDED TOUR SYSTEM
// Version: 2.0.2
// ====================================

/**
 * Interactive tour guide for first-time users
 * Shows step-by-step instructions with visual overlays
 */

const TourGuide = {
    currentStep: 0,
    isActive: false,
    
    steps: [
        {
            title: "Welcome to Horadric AI! 🎮",
            description: "Let's get you started in 3 easy steps. This tour will show you how to analyze your Diablo 4 loot using AI.",
            target: null,
            position: "center"
        },
        {
            title: "Step 1: Get Your Free API Key 🔑",
            description: "Click the '?' button to learn how to get a free Google Gemini API key. It takes less than 2 minutes and it's completely free!",
            target: "#help-trigger",
            position: "bottom"
        },
        {
            title: "Step 2: Select Your Class ⚔️",
            description: "Choose your character class for personalized recommendations. The AI will tailor its analysis to your build!",
            target: "#player-class",
            position: "bottom"
        },
        {
            title: "Step 3: Choose Your Build Focus (Optional) 🎯",
            description: "Tell us what matters most to your build! Are you focused on damage, defense, speed, or something else? This helps the AI prioritize the right stats for YOU.",
            target: "#build-style",
            position: "bottom"
        },
        {
            title: "Step 4: Upload Your Item 📸",
            description: "Take a screenshot of your item in-game and upload it here. Supports PNG, JPEG, and WebP formats up to 10MB.",
            target: "#image-upload",
            position: "bottom"
        },
        {
            title: "Try Demo Mode First! 🎭",
            description: "Want to see it in action before getting an API key? Click 'Try Demo Mode' to see a sample analysis of a Unique item.",
            target: "#demo-btn",
            position: "top"
        },
        {
            title: "You're All Set! 🚀",
            description: "That's it! Get your API key, select your class and build, upload an item, and let Horadric AI help you find the best loot. Happy hunting, Nephalem!",
            target: null,
            position: "center"
        }
    ],
    
    /**
     * Initialize tour system
     */
    init() {
        this.createOverlay();
        this.attachEventListeners();
        this.checkFirstVisit();
    },
    
    /**
     * Check if this is user's first visit
     */
    checkFirstVisit() {
        const hasSeenTour = localStorage.getItem('horadric_tour_completed');
        
        if (!hasSeenTour) {
            // Wait 1 second after page load
            setTimeout(() => {
                this.start();
            }, 1000);
        }
    },
    
    /**
     * Create tour overlay elements
     */
    createOverlay() {
        // Main overlay
        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.className = 'tour-overlay hidden';
        overlay.innerHTML = `
            <div class="tour-backdrop"></div>
            <div class="tour-spotlight"></div>
            <div class="tour-tooltip">
                <div class="tour-content">
                    <h3 class="tour-title"></h3>
                    <p class="tour-description"></p>
                </div>
                <div class="tour-controls">
                    <button id="tour-skip" class="tour-btn tour-skip">Skip Tour</button>
                    <div class="tour-progress">
                        <span class="tour-step-counter"></span>
                    </div>
                    <button id="tour-next" class="tour-btn tour-next">Next</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        document.getElementById('tour-skip')?.addEventListener('click', () => this.skip());
        document.getElementById('tour-next')?.addEventListener('click', () => this.next());
        
        // Escape key to skip
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.skip();
            }
        });
        
        // Handle window resize to reposition tooltip
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (!this.isActive) return;
            
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.currentStep < this.steps.length) {
                    this.positionTooltip(this.steps[this.currentStep]);
                }
            }, 250);
        });
    },
    
    /**
     * Start the tour
     */
    start() {
        this.currentStep = 0;
        this.isActive = true;
        
        const overlay = document.getElementById('tour-overlay');
        overlay.classList.remove('hidden');
        
        this.showStep(0);
        
        // Track tour start
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_started', {
                timestamp: new Date().toISOString()
            });
        }
    },
    
    /**
     * Show specific step
     */
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update content
        document.querySelector('.tour-title').textContent = step.title;
        document.querySelector('.tour-description').textContent = step.description;
        document.querySelector('.tour-step-counter').textContent = `${stepIndex + 1} / ${this.steps.length}`;
        
        // Update button text for last step
        const nextBtn = document.getElementById('tour-next');
        if (stepIndex === this.steps.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
        
        // Position tooltip and spotlight
        this.positionTooltip(step);
        
        // Track step view
        if (typeof Analytics !== 'undefined') {
            Analytics.trackUserJourneyStep(step.title, stepIndex + 1, this.steps.length);
        }
    },
    
    /**
     * Position tooltip relative to target element
     */
    positionTooltip(step) {
        const tooltip = document.querySelector('.tour-tooltip');
        const spotlight = document.querySelector('.tour-spotlight');
        const isMobile = window.innerWidth <= 600;
        
        if (!step.target) {
            // Center position
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            spotlight.style.display = 'none';
            return;
        }
        
        const target = document.querySelector(step.target);
        if (!target) {
            console.warn(`Tour target not found: ${step.target}`);
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            spotlight.style.display = 'none';
            return;
        }
        
        const rect = target.getBoundingClientRect();
        
        // Position spotlight
        spotlight.style.display = 'block';
        spotlight.style.top = `${rect.top - 8}px`;
        spotlight.style.left = `${rect.left - 8}px`;
        spotlight.style.width = `${rect.width + 16}px`;
        spotlight.style.height = `${rect.height + 16}px`;
        
        // Scroll target into view - adjust for mobile
        if (isMobile) {
            // On mobile, scroll element to top to make room for tooltip at bottom
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Position tooltip
        tooltip.style.position = 'fixed';
        
        // On mobile, always place tooltip at bottom of screen
        if (isMobile) {
            tooltip.style.bottom = '20px';
            tooltip.style.top = 'auto';
            tooltip.style.left = '5%';
            tooltip.style.right = '5%';
            tooltip.style.transform = 'none';
            tooltip.style.width = '90%';
            return;
        }
        
        // Desktop positioning
        if (step.position === 'bottom') {
            tooltip.style.top = `${rect.bottom + 20}px`;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.transform = 'translateX(-50%)';
        } else if (step.position === 'top') {
            tooltip.style.top = `${rect.top - 20}px`;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
        } else if (step.position === 'right') {
            tooltip.style.top = `${rect.top + rect.height / 2}px`;
            tooltip.style.left = `${rect.right + 20}px`;
            tooltip.style.transform = 'translateY(-50%)';
        } else if (step.position === 'left') {
            tooltip.style.top = `${rect.top + rect.height / 2}px`;
            tooltip.style.left = `${rect.left - 20}px`;
            tooltip.style.transform = 'translate(-100%, -50%)';
        }
        
        // Keep tooltip on screen (desktop only)
        setTimeout(() => {
            const tooltipRect = tooltip.getBoundingClientRect();
            if (tooltipRect.bottom > window.innerHeight) {
                tooltip.style.top = `${window.innerHeight - tooltipRect.height - 20}px`;
            }
            if (tooltipRect.top < 0) {
                tooltip.style.top = '20px';
            }
            if (tooltipRect.right > window.innerWidth) {
                tooltip.style.left = `${window.innerWidth - tooltipRect.width - 20}px`;
                tooltip.style.transform = 'none';
            }
            if (tooltipRect.left < 0) {
                tooltip.style.left = '20px';
                tooltip.style.transform = 'none';
            }
        }, 100);
    },
    
    /**
     * Go to next step
     */
    next() {
        this.showStep(this.currentStep + 1);
    },
    
    /**
     * Skip tour
     */
    skip() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        overlay.classList.add('hidden');
        
        localStorage.setItem('horadric_tour_completed', 'true');
        
        // Track skip
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_skipped', {
                step: this.currentStep + 1,
                total_steps: this.steps.length
            });
        }
    },
    
    /**
     * Complete tour
     */
    complete() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        overlay.classList.add('hidden');
        
        localStorage.setItem('horadric_tour_completed', 'true');
        
        // Track completion
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_completed', {
                timestamp: new Date().toISOString()
            });
        }
    },
    
    /**
     * Restart tour (called from help modal)
     */
    restart() {
        localStorage.removeItem('horadric_tour_completed');
        this.start();
        
        // Close help modal if open
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.style.display = 'none';
        }
        
        // Track restart
        if (typeof Analytics !== 'undefined') {
            Analytics.trackMilestone('tour_restarted', {
                timestamp: new Date().toISOString()
            });
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TourGuide.init());
} else {
    TourGuide.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourGuide;
}
