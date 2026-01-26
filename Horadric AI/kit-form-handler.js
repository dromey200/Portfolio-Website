// ====================================
// HORADRIC AI - KIT FORM HANDLER
// Version: 2.0.3
// ====================================

/**
 * Enhanced Kit (formerly ConvertKit) form handler
 * Provides better UX with inline feedback and analytics tracking
 */

const KitFormHandler = {
    formId: '8985038',
    isSubmitting: false,
    
    /**
     * Initialize form handler
     */
    init() {
        const form = document.getElementById('kit-signup-form');
        
        if (!form) {
            console.warn('Kit signup form not found');
            return;
        }
        
        // Attach submit handler
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        console.log('✅ Kit form handler initialized');
    },
    
    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = event.target;
        const emailInput = document.getElementById('kit-email');
        const submitBtn = document.getElementById('kit-submit-btn');
        const successMsg = document.getElementById('kit-success-message');
        const errorMsg = document.getElementById('kit-error-message');
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }
        
        // Set submitting state
        this.isSubmitting = true;
        this.setLoadingState(submitBtn, true);
        this.hideMessages();
        
        try {
            // Submit to Kit
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email_address: email
                }),
                mode: 'no-cors' // Kit handles CORS
            });
            
            // Since we use no-cors, we can't read the response
            // But if no error was thrown, assume success
            this.handleSuccess(emailInput, submitBtn, successMsg);
            
            // Track with analytics
            if (typeof Analytics !== 'undefined') {
                const emailDomain = email.split('@')[1] || 'unknown';
                Analytics.trackBetaSignupSubmit(email);
                Analytics.trackBetaSignupSuccess();
                Analytics.trackConversionFunnel('beta_signup', true);
                
                // Track milestone
                Analytics.trackMilestone('beta_list_joined', {
                    email_domain: emailDomain,
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('Kit form submission error:', error);
            this.handleError(errorMsg);
            
            // Track error
            if (typeof Analytics !== 'undefined') {
                Analytics.trackError('kit_form_error', error.message, 'beta_signup');
                Analytics.trackBetaSignupError(error.name || 'unknown');
            }
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(submitBtn, false);
        }
    },
    
    /**
     * Handle successful submission
     */
    handleSuccess(emailInput, submitBtn, successMsg) {
        // Show success message
        successMsg.style.display = 'block';
        
        // Clear email input
        emailInput.value = '';
        
        // Scroll to message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 10 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 10000);
    },
    
    /**
     * Handle submission error
     */
    handleError(errorMsg) {
        errorMsg.style.display = 'block';
        
        // Scroll to message
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 8 seconds
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 8000);
    },
    
    /**
     * Show error message
     */
    showError(message) {
        const errorMsg = document.getElementById('kit-error-message');
        errorMsg.textContent = `⚠️ ${message}`;
        errorMsg.style.display = 'block';
        
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    },
    
    /**
     * Hide all messages
     */
    hideMessages() {
        document.getElementById('kit-success-message').style.display = 'none';
        document.getElementById('kit-error-message').style.display = 'none';
    },
    
    /**
     * Set button loading state
     */
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Joining...';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.textContent = 'Join';
            button.style.opacity = '1';
        }
    },
    
    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KitFormHandler.init());
} else {
    KitFormHandler.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KitFormHandler;
}
