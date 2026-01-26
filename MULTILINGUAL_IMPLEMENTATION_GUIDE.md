# Multilingual Portfolio Implementation Guide

## Overview
This guide will help you complete the multilingual implementation for your portfolio website.

## Files Included
1. `i18n.js` - Complete internationalization system with automatic language detection
2. `translations.json` - Already complete with 5 languages (en, es, fr, ja, pt)
3. HTML updates needed - See below

## Step 1: Add i18n.js to Your HTML

Add this line in your `<head>` section, BEFORE your main script.js:

```html
<script src="i18n.js"></script>
```

Your head should look like:
```html
<head>
    <!-- ... existing meta tags ... -->
    <link rel="stylesheet" href="style.css">
    <script src="i18n.js"></script>  <!-- ADD THIS -->
    <!-- ... rest of head ... -->
</head>
```

## Step 2: Initialize i18n in Your script.js

At the VERY TOP of your script.js file, add:

```javascript
// Initialize i18n first
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize translations
    await window.i18n.init();
    
    // Then run the rest of your code...
    initializePortfolio();
});

function initializePortfolio() {
    // Move ALL your existing DOMContentLoaded code here
    const portfolioGrid = document.querySelector('.portfolio-grid');
    // ... rest of your existing code ...
}
```

## Step 3: Add data-i18n Attributes to HTML

Replace the hardcoded text in your HTML with data-i18n attributes. Here are the key sections:

### HEADER (lines 33-50)
```html
<header id="header">
    <div class="container">
        <h1 data-i18n="header.name">Daniel Romeyn <i class="fas fa-magic header-icon"></i></h1>
        <nav class="desktop-nav">
            <ul>
                <li><a href="#hero" data-i18n="nav.home">Home</a></li>
                <li><a href="#about" data-i18n="nav.about">About</a></li>
                <li><a href="#career" data-i18n="nav.career">Career</a></li>
                <li><a href="#portfolio" data-i18n="nav.portfolio">Portfolio</a></li>
                <li><a href="#services" data-i18n="nav.services">Services</a></li>
                <li><a href="#contact" data-i18n="nav.contact">Contact</a></li>
            </ul>
        </nav>
        <!-- ... menu toggle ... -->
    </div>
</header>
```

### MOBILE NAV (lines 52-66)
```html
<div class="mobile-nav-overlay" id="mobileNavOverlay">
    <button class="close-menu" aria-label="Close menu">
        <i class="fas fa-times"></i>
    </button>
    <nav class="mobile-nav">
        <ul>
            <li><a href="#hero" class="nav-link" data-i18n="nav.home">Home</a></li>
            <li><a href="#about" class="nav-link" data-i18n="nav.about">About</a></li>
            <li><a href="#career" class="nav-link" data-i18n="nav.career">Career</a></li>
            <li><a href="#portfolio" class="nav-link" data-i18n="nav.portfolio">Portfolio</a></li>
            <li><a href="#services" class="nav-link" data-i18n="nav.services">Services</a></li>
            <li><a href="#contact" class="nav-link" data-i18n="nav.contact">Contact</a></li>
        </ul>
    </nav>
</div>
```

### HERO SECTION (lines 68-74)
```html
<section id="hero" class="hero animate-on-scroll">
    <div class="container">
        <h2 data-i18n="hero.title">Innovative UX Specialist | Conversational & AI Agent Design Leader | Transforming User Interactions</h2>
        <p data-i18n="hero.subtitle">Passionate about crafting intuitive digital experiences that delight users and drive business goals.</p>
        <a href="#portfolio" class="btn" data-i18n="hero.cta">View My Work</a>
    </div>
</section>
```

### ABOUT SECTION (lines 76-96)
```html
<section id="about" class="about animate-on-scroll">
    <div class="container">
        <div class="about-content">
            <div class="about-image">
                <img src="IMG_2357.jpg" alt="Headshot of Daniel Romeyn" loading="lazy">
            </div>
            <div class="about-text">
                <h3 data-i18n="about.title">About Me</h3>
                <p data-i18n="about.intro">As a Senior UX Specialist...</p>
                <p data-i18n="about.p1">With a strong background...</p>
                <p data-i18n="about.expertise">My core expertise includes:</p>
                <ul>
                    <li data-i18n="about.expertise.ux"><strong>User Experience (UX) Design:</strong> User Research...</li>
                    <li data-i18n="about.expertise.ai"><strong>AI & Conversational Design:</strong> Specializing...</li>
                    <li data-i18n="about.expertise.tools"><strong>Tools & Methodologies:</strong> Proficient...</li>
                </ul>
                <p data-i18n="about.closing">I am always open to new opportunities...</p>
            </div>
        </div>
    </div>
</section>
```

### CAREER SECTION (lines 98-107)
```html
<section id="career" class="brands animate-on-scroll">
    <div class="container">
        <h2 data-i18n="career.title">Career</h2>
        <div class="brand-logos">
            <div class="brand-item">
                <img src="Xfinity-logo.png" alt="Xfinity Logo" loading="lazy">
                <p>Xfinity</p>
            </div>
        </div>
        <p class="brand-intro-text" data-i18n="career.intro">Throughout my career...</p>
        <p class="brand-intro-text" data-i18n="career.collab">My work often involves...</p>
    </div>
</section>
```

### FEATURED CASE STUDY SECTION (lines 109-155)
```html
<section id="featured-case-study" class="featured-section animate-on-scroll">
    <div class="container">
        <div class="case-study-layout">
            <div class="case-study-header">
                <span class="tag" data-i18n="featured.tag">Featured Case Study</span>
                <h2 data-i18n="featured.title">Horadric AI: The 48-Hour Pivot</h2>
                <p data-i18n="featured.description">How I used real-time analytics...</p>
            </div>

            <div class="comparison-grid">
                <div class="case-text">
                    <h4 data-i18n="featured.challenge">The Challenge</h4>
                    <p data-i18n="featured.challengeText">Upon soft-launching "Horadric AI"...</p>
                    
                    <h4 data-i18n="featured.strategy">The Strategy</h4>
                    <ul>
                        <li data-i18n="featured.strategy.gate"><strong>Removed the Gate:</strong> Implemented...</li>
                        <li data-i18n="featured.strategy.logic"><strong>Context-Aware Logic:</strong> Upgraded...</li>
                        <li data-i18n="featured.strategy.tech"><strong>Tech Stack Pivot:</strong> Migrated...</li>
                    </ul>

                    <div class="stat-row">
                        <div class="stat-item"><strong>48 Hrs</strong><span data-i18n="featured.stats.timeline">Timeline</span></div>
                        <div class="stat-item"><strong>Gemini 2.5</strong><span data-i18n="featured.stats.engine">New Engine</span></div>
                        <div class="stat-item"><strong>-80%</strong><span data-i18n="featured.stats.friction">Friction</span></div>
                    </div>
                    
                    <a href="https://www.danielromeyn.com/horadric.html" target="_blank" class="btn btn-small" data-i18n="featured.cta" style="margin-top: 20px;">Try the Live Demo</a>
                </div>
                <!-- ... visual showcase ... -->
            </div>
        </div>
    </div>
</section>
```

### PORTFOLIO SECTION
For each project card, add data-i18n attributes:

```html
<div class="project-card">
    <div class="image-container">
        <img src="horadric-thumb.jpg" alt="Horadric AI Companion" loading="lazy">
    </div>
    <h3 data-i18n="portfolio.horadric.title">Concept: Horadric – AI Build Companion</h3>
    <p class="role" data-i18n="portfolio.horadric.role">Role: Lead Product Designer & AI Strategist</p>
    <p data-i18n="portfolio.horadric.description">A multi-modal AI agent concept...</p>
    <div class="project-tags">
        <span>#MultiModalAI</span>
        <span>#ComputerVision</span>
        <span>#GamingUX</span>
        <span>#Concept</span>
    </div>
    <a href="#" class="btn-small view-project-btn" data-project-id="horadric-companion">View Project</a>
</div>
```

Repeat for all 6 projects with their respective data-i18n keys:
- `portfolio.horadric.*`
- `portfolio.fairway.*`
- `portfolio.deviceLights.*`
- `portfolio.weatherAlerts.*`
- `portfolio.networkImpairment.*`
- `portfolio.xfinityCampus.*`

### SERVICES SECTION
```html
<section id="services" class="services animate-on-scroll">
    <div class="container">
        <h2 data-i18n="services.title">Freelance Services</h2>
        <p class="services-intro" data-i18n="services.intro">I help businesses improve reliability...</p>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon"><i class="fas fa-robot"></i></div>
                <h3 data-i18n="services.conversational.title">Conversational AI Design</h3>
                <p data-i18n="services.conversational.description">Designing chatbots and voice agents...</p>
            </div>
            <div class="service-card">
                <div class="service-icon"><i class="fas fa-clipboard-check"></i></div>
                <h3 data-i18n="services.audit.title">UX Audits & Strategy</h3>
                <p data-i18n="services.audit.description">Expert review of your existing product...</p>
            </div>
            <div class="service-card">
                <div class="service-icon"><i class="fas fa-layer-group"></i></div>
                <h3 data-i18n="services.prototyping.title">Prototyping & Wireframing</h3>
                <p data-i18n="services.prototyping.description">Turning loose ideas into high-fidelity...</p>
            </div>
        </div>
        <a href="#contact" class="btn" data-i18n="services.cta">Start a Project</a>
    </div>
</section>
```

### CONTACT SECTION
```html
<section id="contact" class="contact animate-on-scroll">
    <div class="container">
        <h2 data-i18n="contact.title">Ready to Build Something Great? 🚀</h2>
        <p class="contact-intro" data-i18n="contact.intro">I'm currently accepting select freelance projects...</p>
        <div class="cta-wrapper">
            <a href="mailto:dan.romeyn@gmail.com?subject=Project%20Inquiry%3A%20[Insert%20Topic]" class="btn btn-large" data-i18n="contact.cta">Start a Project</a>
        </div>
        <div class="contact-divider"><span data-i18n="contact.or">OR</span></div>
        <div class="contact-info">
            <p><i class="fas fa-envelope contact-icon"></i> <span data-i18n="contact.email">Email:</span> <a href="mailto:dan.romeyn@gmail.com">dan.romeyn@gmail.com</a></p>
            <p><i class="fab fa-linkedin contact-icon"></i> <span data-i18n="contact.linkedin">LinkedIn:</span> <a href="https://www.linkedin.com/in/daniel-romeyn" target="_blank" rel="noopener noreferrer">linkedin.com/in/daniel-romeyn</a></p>
        </div>
    </div>
</section>
```

### FOOTER
```html
<footer>
    <div class="container">
        <p>&copy; <span id="current-year"></span> Daniel Romeyn. <span data-i18n="footer.copyright">All rights reserved.</span></p>
    </div>
</footer>
```

## Step 4: Update Modal Content Dynamically

Since your modals use JavaScript to populate content, you need to update the project data in `script.js` to use translations.

Add this function to your script.js:

```javascript
function getLocalizedProjectData(projectId) {
    const lang = window.i18n.getLanguage();
    
    // Base data that doesn't change
    const baseData = {
        'horadric-companion': {
            image: 'horadric-thumb.jpg',
            tags: ['Multi-Modal AI', 'Computer Vision', 'Gaming UX', 'Strategy', 'Mobile Design'],
        },
        'fairway-concierge': {
            image: 'fairway-image.jpg',
            tags: ['Conversational AI', 'Concept', 'UX Strategy', 'Service Design', 'Prototyping'],
        },
        'device-lights': {
            image: 'device lights.jpg',
            tags: ['Conversational AI', 'User Flow', 'Problem Solving', 'Customer Support', 'AI Agent Design'],
        },
        'weather-alerts': {
            image: 'WIMFW.jpg',
            tags: ['UX Design', 'Messaging', 'IoT', 'User Trial', 'Service Design', 'Proactive Communication'],
        },
        'network-impairment': {
            image: 'single home.jpg',
            tags: ['Network Monitoring', 'Customer Experience', 'Telemetry', 'UX Design', 'Service Design', 'Scalable Solutions', 'Data-Driven Design'],
        },
        'xfinity-on-campus': {
            image: 'XOC.jpg',
            tags: ['UX Design', 'Conversational AI', 'Troubleshooting', 'Self-Service', 'Customer Support', 'Higher Education'],
        }
    };
    
    // Map project IDs to translation keys
    const projectKeyMap = {
        'horadric-companion': 'horadric',
        'fairway-concierge': 'fairway',
        'device-lights': 'deviceLights',
        'weather-alerts': 'weatherAlerts',
        'network-impairment': 'networkImpairment',
        'xfinity-on-campus': 'xfinityCampus'
    };
    
    const projectKey = projectKeyMap[projectId];
    const t = window.i18n.t(`portfolio.projects.${projectKey}`);
    
    return {
        title: window.i18n.t(`portfolio.projects.${projectKey}.title`),
        role: window.i18n.t(`portfolio.projects.${projectKey}.role`),
        description: window.i18n.t(`portfolio.projects.${projectKey}.description`),
        image: baseData[projectId].image,
        tags: baseData[projectId].tags
    };
}
```

Then update your modal click handler:

```javascript
viewProjectButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const projectId = button.dataset.projectId;
        const project = getLocalizedProjectData(projectId);

        if (project) {
            modalProjectTitle.textContent = project.title;
            modalProjectRole.textContent = `${window.i18n.t('portfolio.role')}: ${project.role}`;
            modalProjectImage.src = project.image;
            modalProjectImage.alt = project.title;
            modalProjectDescription.innerHTML = project.description.replace(/\n/g, '<br>');
            modalProjectTags.innerHTML = '';
            project.tags.forEach(tagText => {
                const span = document.createElement('span');
                span.textContent = `#${tagText}`;
                modalProjectTags.appendChild(span);
            });
            projectModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            projectModal.focus();
        }
    });
});
```

## Step 5: Testing

1. Upload `i18n.js` to your server
2. Make sure `translations.json` is in the same directory
3. Update your HTML with data-i18n attributes
4. Update your script.js as shown above
5. Test in different browsers:
   - Chrome with English
   - Change browser language to Spanish
   - Test with French, Japanese, Portuguese

## Step 6: Add Language Selector (Optional)

If you want to add a manual language selector, add this HTML to your header:

```html
<div class="language-selector">
    <select id="language-select">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="ja">日本語</option>
        <option value="pt">Português</option>
    </select>
</div>
```

And this JavaScript:

```javascript
document.getElementById('language-select').addEventListener('change', async (e) => {
    await window.i18n.setLanguage(e.target.value);
    location.reload(); // Reload to re-apply all translations
});

// Set the select value to current language
window.addEventListener('load', () => {
    const currentLang = window.i18n.getLanguage();
    document.getElementById('language-select').value = currentLang;
});
```

## How It Works

1. **Automatic Detection**: When a user visits your site, `i18n.js` automatically detects their browser language
2. **Supported Languages**: If their language is one of: en, es, fr, ja, pt - it loads that translation
3. **Fallback**: If not supported, defaults to English
4. **Local Storage**: Remembers the user's language preference
5. **Dynamic Updates**: All text with `data-i18n` attributes gets automatically updated

## Troubleshooting

**Problem**: Translations not loading
**Solution**: Make sure `translations.json` is in the root directory and accessible

**Problem**: Some text not translating
**Solution**: Check that you added the `data-i18n` attribute to that element

**Problem**: Page flickers on load
**Solution**: Add this CSS to hide content until translations load:
```css
body.loading {
    opacity: 0;
}
```

Then in i18n.js, add:
```javascript
async init() {
    document.body.classList.add('loading');
    await this.loadTranslations();
    const detectedLang = this.detectLanguage();
    await this.setLanguage(detectedLang);
    document.body.classList.remove('loading');
}
```
