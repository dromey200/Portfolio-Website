// PORTFOLIO PROJECT: Daniel Romeyn's Portfolio
// This file is part of the daniel-portfolio project, not the Horadric AI app

// Initialize i18n and then the portfolio
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize translations first
    if (window.i18n) {
        await window.i18n.init();
    }
    
    // Then initialize portfolio functionality
    initializePortfolio();
});

function initializePortfolio() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    const projectCards = document.querySelectorAll('.project-card');

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // --- Modal Elements ---
    const projectModal = document.getElementById('projectModal');
    const closeProjectModalBtn = document.querySelector('#projectModal .close-button');
    const viewProjectButtons = document.querySelectorAll('.project-card .view-project-btn');

    // Elements to populate inside the modal
    const modalProjectTitle = document.getElementById('modal-project-title');
    const modalProjectRole = document.getElementById('modal-project-role');
    const modalProjectImage = document.getElementById('modal-project-image');
    const modalProjectDescription = document.getElementById('modal-project-description');
    const modalProjectTags = document.getElementById('modal-project-tags');

    // --- Get Localized Project Data ---
    function getLocalizedProjectData(projectId) {
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
        
        // Extended descriptions for modals (English - will be used if i18n not available)
        const extendedDescriptions = {
            'horadric-companion': 'Designed a multi-modal AI agent to solve "analysis paralysis" in complex ARPGs like Diablo. Players often hoard hundreds of items because the math required to know if a new item is a true upgrade is overwhelming, leading to stalled progression and churn.<br><br><strong>The Solution:</strong> Instead of tedious manual entry into calculators, "Horadric" uses Computer Vision (CV) to instantly "read" item stats from screenshots uploaded by the user. The AI then acts as a personalized "Loot Coach," comparing the drop against meta-data to offer mathematically backed build pivots.<br><br><strong>Projected Success Metrics:</strong><br>• <strong>Time-to-Equip:</strong> Reduce user journey from ~15 minutes (manual research) to <30 seconds (AI analysis).<br>• <strong>Pivot Confidence:</strong> Increase user willingness to switch builds by 40% via "Safety Net" math.<br>• <strong>Trust Verification:</strong> Target an "Edit Data" interaction rate of <5% to validate OCR model accuracy.<br><br>Disclaimer: This is a proactive design concept exploring multi-modal AI in gaming.<br><br>👇 <strong>Explore the Design:</strong><br><div style="display: flex; gap: 15px; margin-top: 10px; flex-wrap: wrap;"><a href="horadric-logic.pdf" target="_blank" style="color: #6a89cc; font-weight: bold; text-decoration: none;">📄 View Logic Map (PDF)</a><a href="horadric.html" target="_blank" style="color: #6a89cc; font-weight: bold; text-decoration: none;">📱 Launch Web App (v0.1)</a></div>',
            'fairway-concierge': 'Designed a multi-modal AI agent for a local golf course to automate tee-time bookings and real-time course status updates. The solution aimed to reduce pro-shop call volume by 40% while improving golfer satisfaction.<br><br>Key features included smart booking via natural language, real-time course reliability updates (frost delays, cart rules), and an "At the Turn" food ordering flow.<br><br>Disclaimer: This is a proactive design concept developed to explore AI-driven automation for local service businesses.<br><br>👇 <strong>Explore the Design:</strong><br><div style="display: flex; gap: 15px; margin-top: 10px;"><a href="Fairway-logic-flow.pdf" target="_blank" style="color: #6a89cc; font-weight: bold; text-decoration: none;">📄 View Logic Map (PDF)</a><a href="https://cafe-fir-34608612.figma.site/" target="_blank" style="color: #6a89cc; font-weight: bold; text-decoration: none;">🎨 Try Interactive Prototype</a></div>',
            'device-lights': 'Designed an intuitive conversational flow to clarify the meaning of Xfinity device light colors and sequences for customers. This involved extensive user research to understand common pain points and developing clear, concise language for the conversational AI. The solution significantly reduced calls to customer support related to device status.',
            'weather-alerts': 'Led the design of a new messaging experience for Xfinity customers, alerting them to inclement weather when a smart window or door was open. Played a vital role in establishing and executing an internal employee trial to gather crucial feedback, validating that the concept was well-received by users. This project enhanced smart home functionality and proactive customer communication.',
            'network-impairment': 'Assisted in the creation, rigorous testing, and successful scaling of the first single-home network impairment experience. This critical messaging system leverages customer telemetry data to proactively identify individuals needing technician appointments to resolve signal issues impacting their internet gateway connection. This proactive approach significantly improved customer satisfaction and reduced repeat service calls.',
            'xfinity-on-campus': 'Designed a comprehensive digital solution for students, faculty, and IT to troubleshoot services and find account answers, guiding users to self-service or an agent chat. This platform streamlined support processes for university environments, offering quick access to solutions and reducing the burden on IT staff.'
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
        
        // Try to get translated content, fallback to English if i18n not available
        let title, role, description;
        
        if (window.i18n && window.i18n.translations) {
            title = window.i18n.t(`portfolio.projects.${projectKey}.title`);
            role = window.i18n.t(`portfolio.projects.${projectKey}.role`);
            description = extendedDescriptions[projectId]; // Use extended for modals
        } else {
            // Fallback to hardcoded English
            const fallback = {
                'horadric-companion': {
                    title: 'Concept: Horadric – AI Build Companion',
                    role: 'Lead Product Designer & AI Strategist'
                },
                'fairway-concierge': {
                    title: 'Concept: Fairway – The AI Golf Concierge',
                    role: 'Lead Product Designer & Conversational Strategist'
                },
                'device-lights': {
                    title: 'Xfinity Device Lights',
                    role: 'Experience and Conversational Designer, Developer'
                },
                'weather-alerts': {
                    title: 'Xfinity Inclement Weather Alerts',
                    role: 'Lead Message Experience Designer & Internal Trial Lead'
                },
                'network-impairment': {
                    title: 'Single-Home Network Impairment Experience',
                    role: 'UX Designer - Creation, Testing & Scaling'
                },
                'xfinity-on-campus': {
                    title: 'Xfinity On Campus',
                    role: 'UX Designer, Conversational Designer'
                }
            };
            
            title = fallback[projectId].title;
            role = fallback[projectId].role;
            description = extendedDescriptions[projectId];
        }
        
        return {
            title: title,
            role: role,
            description: description,
            image: baseData[projectId].image,
            tags: baseData[projectId].tags
        };
    }

    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Navigation Functionality ---
    if (menuToggle && mobileNavOverlay && closeMenuBtn) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; 
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Carousel Functionality ---
    if (portfolioGrid && prevBtn && nextBtn && carouselDotsContainer && projectCards.length > 0) {
        const getVisibleItems = () => {
            const gridWidth = portfolioGrid.offsetWidth;
            const cardWidth = projectCards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(portfolioGrid).gap) || 0;
            if (cardWidth === 0) return 1;
            let items = Math.floor(gridWidth / (cardWidth + gap));
            return Math.max(1, items);
        };

        const updateButtonVisibility = () => {
            prevBtn.disabled = portfolioGrid.scrollLeft <= 0;
            const maxScrollLeft = portfolioGrid.scrollWidth - portfolioGrid.offsetWidth;
            nextBtn.disabled = portfolioGrid.scrollLeft >= maxScrollLeft - 1;
        };

        const createDots = () => {
            carouselDotsContainer.innerHTML = '';
            const totalCards = projectCards.length;
            const visibleItems = getVisibleItems();
            const numDots = Math.ceil(totalCards / visibleItems);

            if (numDots <= 1) {
                carouselDotsContainer.style.display = 'none';
                return;
            } else {
                carouselDotsContainer.style.display = 'flex';
            }

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.setAttribute('role', 'button');
                dot.tabIndex = 0;
                dot.addEventListener('click', () => {
                    const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
                    const scrollAmount = cardWidthWithGap * visibleItems * i;
                    portfolioGrid.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                });
                carouselDotsContainer.appendChild(dot);
            }
            updateActiveDot();
        };

        const updateActiveDot = () => {
            const dots = carouselDotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;
            const scrollPosition = portfolioGrid.scrollLeft;
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            const currentPage = Math.round(scrollPosition / (cardWidthWithGap * visibleItems) + 0.01);

            dots.forEach((dot, index) => {
                if (index === currentPage) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        };

        prevBtn.addEventListener('click', () => {
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({ left: -(cardWidthWithGap * visibleItems), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidthWithGap = projectCards[0].offsetWidth + parseFloat(getComputedStyle(portfolioGrid).gap);
            const visibleItems = getVisibleItems();
            portfolioGrid.scrollBy({ left: (cardWidthWithGap * visibleItems), behavior: 'smooth' });
        });

        portfolioGrid.addEventListener('scroll', () => {
            updateButtonVisibility();
            updateActiveDot();
        });

        createDots();
        updateButtonVisibility();
        updateActiveDot();
        window.addEventListener('resize', () => {
            createDots();
            updateButtonVisibility();
            updateActiveDot();
        });
    }

    // --- Project Modal Functionality ---
    if (projectModal && closeProjectModalBtn && viewProjectButtons.length > 0) {
        viewProjectButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const projectId = button.dataset.projectId;
                const project = getLocalizedProjectData(projectId);

                if (project) {
                    modalProjectTitle.textContent = project.title;
                    modalProjectRole.textContent = `Role: ${project.role}`;
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
                } else {
                    console.error('Project data not found for ID:', projectId);
                }
            });
        });

        const closeModal = () => {
            projectModal.style.display = 'none';
            document.body.style.overflow = '';
        };

        closeProjectModalBtn.addEventListener('click', closeModal);
        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && projectModal.style.display === 'flex') closeModal();
        });
    }

    // --- Scroll Animations ---
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('fade-in-up');
            else entry.target.classList.remove('fade-in-up');
        });
    }, { threshold: 0.1 });

    sectionsToAnimate.forEach(section => sectionObserver.observe(section));
    const heroSection = document.getElementById('hero');
    if (heroSection) setTimeout(() => heroSection.classList.add('fade-in-up'), 100);
}
