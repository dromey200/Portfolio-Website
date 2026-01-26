// PORTFOLIO PROJECT: Daniel Romeyn's Portfolio - Internationalization (i18n)
// Multi-language support with automatic browser language detection

class I18n {
    constructor() {
        this.translations = null;
        this.currentLang = null;
        this.supportedLanguages = ['en', 'es', 'fr', 'ja', 'pt'];
        this.defaultLanguage = 'en';
    }

    async init() {
        // Load translations
        await this.loadTranslations();
        
        // Detect and set language
        const detectedLang = this.detectLanguage();
        await this.setLanguage(detectedLang);
    }

    async loadTranslations() {
        try {
            const response = await fetch('translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to default language if translations fail to load
            this.currentLang = this.defaultLanguage;
        }
    }

    detectLanguage() {
        // Check if language is stored in localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang && this.supportedLanguages.includes(storedLang)) {
            return storedLang;
        }

        // Detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get 'es' from 'es-MX'

        // Check if detected language is supported
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }

        // Default to English
        return this.defaultLanguage;
    }

    async setLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            langCode = this.defaultLanguage;
        }

        this.currentLang = langCode;
        localStorage.setItem('preferredLanguage', langCode);

        // Update HTML lang attribute
        document.documentElement.lang = langCode;

        // Apply translations
        this.applyTranslations();
    }

    applyTranslations() {
        if (!this.translations || !this.translations[this.currentLang]) {
            console.error('Translations not loaded for language:', this.currentLang);
            return;
        }

        const t = this.translations[this.currentLang];

        // Update page title and meta
        document.title = t.pageTitle;
        this.updateMetaTag('og:title', `${t.header.name} | AI & UX Specialist`);
        this.updateMetaTag('og:description', t.pageDescription);

        // Header
        this.setText('[data-i18n="header.name"]', t.header.name);
        this.setText('[data-i18n="nav.home"]', t.header.nav.home);
        this.setText('[data-i18n="nav.about"]', t.header.nav.about);
        this.setText('[data-i18n="nav.career"]', t.header.nav.career);
        this.setText('[data-i18n="nav.portfolio"]', t.header.nav.portfolio);
        this.setText('[data-i18n="nav.services"]', t.header.nav.services);
        this.setText('[data-i18n="nav.contact"]', t.header.nav.contact);

        // Hero section
        this.setText('[data-i18n="hero.title"]', t.hero.title);
        this.setText('[data-i18n="hero.subtitle"]', t.hero.subtitle);
        this.setText('[data-i18n="hero.cta"]', t.hero.cta);

        // About section
        this.setText('[data-i18n="about.title"]', t.about.title);
        this.setText('[data-i18n="about.intro"]', t.about.intro);
        this.setText('[data-i18n="about.p1"]', t.about.p1);
        this.setText('[data-i18n="about.expertise"]', t.about.expertise);
        this.setHTML('[data-i18n="about.expertise.ux"]', t.about.expertiseItems.ux);
        this.setHTML('[data-i18n="about.expertise.ai"]', t.about.expertiseItems.ai);
        this.setHTML('[data-i18n="about.expertise.tools"]', t.about.expertiseItems.tools);
        this.setText('[data-i18n="about.closing"]', t.about.closing);

        // Career section
        this.setText('[data-i18n="career.title"]', t.career.title);
        this.setText('[data-i18n="career.intro"]', t.career.intro);
        this.setText('[data-i18n="career.collab"]', t.career.collab);

        // Featured Case Study
        this.setText('[data-i18n="featured.tag"]', t.featuredCaseStudy.tag);
        this.setText('[data-i18n="featured.title"]', t.featuredCaseStudy.title);
        this.setText('[data-i18n="featured.description"]', t.featuredCaseStudy.description);
        this.setText('[data-i18n="featured.challenge"]', t.featuredCaseStudy.challenge);
        this.setText('[data-i18n="featured.challengeText"]', t.featuredCaseStudy.challengeText);
        this.setText('[data-i18n="featured.strategy"]', t.featuredCaseStudy.strategy);
        this.setHTML('[data-i18n="featured.strategy.gate"]', t.featuredCaseStudy.strategyItems.gate);
        this.setHTML('[data-i18n="featured.strategy.logic"]', t.featuredCaseStudy.strategyItems.logic);
        this.setHTML('[data-i18n="featured.strategy.tech"]', t.featuredCaseStudy.strategyItems.tech);
        this.setText('[data-i18n="featured.stats.timeline"]', t.featuredCaseStudy.stats.timeline);
        this.setText('[data-i18n="featured.stats.engine"]', t.featuredCaseStudy.stats.engine);
        this.setText('[data-i18n="featured.stats.friction"]', t.featuredCaseStudy.stats.friction);
        this.setText('[data-i18n="featured.cta"]', t.featuredCaseStudy.cta);

        // Portfolio section
        this.setText('[data-i18n="portfolio.title"]', t.portfolio.title);
        
        // Portfolio projects (cards)
        this.setText('[data-i18n="portfolio.horadric.title"]', t.portfolio.projects.horadric.title);
        this.setText('[data-i18n="portfolio.horadric.role"]', t.portfolio.projects.horadric.role);
        this.setText('[data-i18n="portfolio.horadric.description"]', t.portfolio.projects.horadric.description);
        
        this.setText('[data-i18n="portfolio.fairway.title"]', t.portfolio.projects.fairway.title);
        this.setText('[data-i18n="portfolio.fairway.role"]', t.portfolio.projects.fairway.role);
        this.setText('[data-i18n="portfolio.fairway.description"]', t.portfolio.projects.fairway.description);
        
        this.setText('[data-i18n="portfolio.deviceLights.title"]', t.portfolio.projects.deviceLights.title);
        this.setText('[data-i18n="portfolio.deviceLights.role"]', t.portfolio.projects.deviceLights.role);
        this.setText('[data-i18n="portfolio.deviceLights.description"]', t.portfolio.projects.deviceLights.description);
        
        this.setText('[data-i18n="portfolio.weatherAlerts.title"]', t.portfolio.projects.weatherAlerts.title);
        this.setText('[data-i18n="portfolio.weatherAlerts.role"]', t.portfolio.projects.weatherAlerts.role);
        this.setText('[data-i18n="portfolio.weatherAlerts.description"]', t.portfolio.projects.weatherAlerts.description);
        
        this.setText('[data-i18n="portfolio.networkImpairment.title"]', t.portfolio.projects.networkImpairment.title);
        this.setText('[data-i18n="portfolio.networkImpairment.role"]', t.portfolio.projects.networkImpairment.role);
        this.setText('[data-i18n="portfolio.networkImpairment.description"]', t.portfolio.projects.networkImpairment.description);
        
        this.setText('[data-i18n="portfolio.xfinityCampus.title"]', t.portfolio.projects.xfinityCampus.title);
        this.setText('[data-i18n="portfolio.xfinityCampus.role"]', t.portfolio.projects.xfinityCampus.role);
        this.setText('[data-i18n="portfolio.xfinityCampus.description"]', t.portfolio.projects.xfinityCampus.description);

        // Services section
        this.setText('[data-i18n="services.title"]', t.services.title);
        this.setText('[data-i18n="services.intro"]', t.services.intro);
        this.setText('[data-i18n="services.conversational.title"]', t.services.conversational.title);
        this.setText('[data-i18n="services.conversational.description"]', t.services.conversational.description);
        this.setText('[data-i18n="services.audit.title"]', t.services.audit.title);
        this.setText('[data-i18n="services.audit.description"]', t.services.audit.description);
        this.setText('[data-i18n="services.prototyping.title"]', t.services.prototyping.title);
        this.setText('[data-i18n="services.prototyping.description"]', t.services.prototyping.description);
        this.setText('[data-i18n="services.cta"]', t.services.cta);

        // Contact section
        this.setText('[data-i18n="contact.title"]', t.contact.title);
        this.setText('[data-i18n="contact.intro"]', t.contact.intro);
        this.setText('[data-i18n="contact.cta"]', t.contact.cta);
        this.setText('[data-i18n="contact.or"]', t.contact.or);
        this.setText('[data-i18n="contact.email"]', t.contact.email);
        this.setText('[data-i18n="contact.linkedin"]', t.contact.linkedin);

        // Footer
        this.setText('[data-i18n="footer.copyright"]', t.footer.copyright);

        // Update modal "View Project" button text
        document.querySelectorAll('.view-project-btn').forEach(btn => {
            btn.textContent = this.getViewProjectText();
        });
    }

    getViewProjectText() {
        const translations = {
            'en': 'View Project',
            'es': 'Ver Proyecto',
            'fr': 'Voir le Projet',
            'ja': 'プロジェクトを見る',
            'pt': 'Ver Projeto'
        };
        return translations[this.currentLang] || translations['en'];
    }

    setText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.textContent = text;
        });
    }

    setHTML(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.innerHTML = html;
        });
    }

    updateMetaTag(property, content) {
        const meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
            meta.setAttribute('content', content);
        }
    }

    // Get current language
    getLanguage() {
        return this.currentLang;
    }

    // Get translation for a specific key
    t(key) {
        if (!this.translations || !this.translations[this.currentLang]) {
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return value;
    }
}

// Initialize i18n when DOM is ready
const i18n = new I18n();

// Export for global use
window.i18n = i18n;
