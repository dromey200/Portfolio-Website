// ====================================
// HORADRIC AI - MAIN APPLICATION
// Version: 2.0.2
// ====================================

/**
 * Main Application Module
 * Handles all user interactions, AI calls, and feature coordination
 * GEMINI ONLY VERSION
 */

const HoradricApp = {
    // ====================================
    // STATE MANAGEMENT
    // ====================================
    
    state: {
        currentProvider: 'gemini',
        currentModel: null,
        currentAnalysis: null,
        currentItemName: null,
        currentRarity: null,
        abortController: null,
        analysisStartTime: null,
        sessionCost: 0,
        sessionScans: 0,
        history: [],
        helpModalOpenTime: null
    },
    
    // DOM Elements Cache
    el: {},
    
    // ====================================
    // INITIALIZATION
    // ====================================
    
    init() {
        console.log('🎮 Initializing Horadric AI...');
        
        this.cacheElements();
        this.loadSettings();
        this.loadHistory();
        this.loadSessionCost();
        this.initializeModel();
        this.attachEventListeners();
        this.checkOnlineStatus();
        this.checkFirstVisit();
        
        console.log('✅ Horadric AI ready!');
    },
    
    /**
     * Cache all DOM elements
     */
    cacheElements() {
        this.el = {
            // API Key
            apiKey: document.getElementById('api-key'),
            apiKeyError: document.getElementById('api-key-error'),
            apiKeySuccess: document.getElementById('api-key-success'),
            getKeyLink: document.getElementById('get-key-link'),
            
            // User Inputs
            playerClass: document.getElementById('player-class'),
            buildStyle: document.getElementById('build-style'),
            fileInput: document.getElementById('image-upload'),
            imageError: document.getElementById('image-error'),
            imageSuccess: document.getElementById('image-success'),
            preview: document.getElementById('image-preview'),
            
            // Progress
            progressContainer: document.getElementById('progress-container'),
            progressBar: document.getElementById('progress-bar'),
            
            // Actions
            analyzeBtn: document.getElementById('analyze-btn'),
            cancelBtn: document.getElementById('cancel-btn'),
            demoBtn: document.getElementById('demo-btn'),
            shareBtn: document.getElementById('share-btn'),
            priceCheckBtn: document.getElementById('price-check-btn'),
            searchTradeBtn: document.getElementById('search-trade-btn'),
            
            // Results
            loading: document.getElementById('loading'),
            resultArea: document.getElementById('result-area'),
            actionButtons: document.getElementById('action-buttons'),
            
            // Price Checker
            priceSection: document.getElementById('price-section'),
            priceContent: document.getElementById('price-content'),
            refreshPriceBtn: document.getElementById('refresh-price-btn'),
            reportPriceBtn: document.getElementById('report-price-btn'),
            viewTradeBtn: document.getElementById('view-trade-btn'),
            
            // History
            historySection: document.getElementById('history-section'),
            historyList: document.getElementById('history-list'),
            clearHistory: document.getElementById('clear-history'),
            
            // Modals
            helpModal: document.getElementById('help-modal'),
            helpTrigger: document.getElementById('help-trigger'),
            modalCloseBtn: document.getElementById('modal-close-btn'),
            modalContent: document.getElementById('modal-content-dynamic'),
            
            privacyModal: document.getElementById('privacy-modal'),
            privacyBtn: document.getElementById('privacy-btn'),
            privacyCloseBtn: document.getElementById('privacy-close-btn'),
            
            priceReportModal: document.getElementById('price-report-modal'),
            priceReportForm: document.getElementById('price-report-form'),
            priceReportCloseBtn: document.getElementById('price-report-close-btn'),
            
            // Other
            offlineBanner: document.getElementById('offline-banner')
        };
    },
    
    /**
     * Load saved settings from localStorage
     */
    loadSettings() {
        try {
            // Always use Gemini
            this.state.currentProvider = 'gemini';
            
            const model = localStorage.getItem('ai_model_gemini');
            if (model) this.state.currentModel = model;
            
            const key = localStorage.getItem('api_key_gemini');
            if (key) this.el.apiKey.value = this.decrypt(key);
            
            const playerClass = localStorage.getItem('player_class');
            if (playerClass) this.el.playerClass.value = playerClass;
            
            const buildStyle = localStorage.getItem('build_style');
            if (buildStyle) this.el.buildStyle.value = buildStyle;
            
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    },
    
    /**
     * Save current settings
     */
    saveSettings() {
        try {
            localStorage.setItem('ai_model_gemini', this.state.currentModel);
            localStorage.setItem('api_key_gemini', this.encrypt(this.el.apiKey.value.trim()));
            localStorage.setItem('player_class', this.el.playerClass.value);
            localStorage.setItem('build_style', this.el.buildStyle.value);
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    },
    
    // ====================================
    // EVENT LISTENERS
    // ====================================
    
    attachEventListeners() {
        // Build Style Selection
        this.el.buildStyle.addEventListener('change', () => {
            this.saveSettings();
            Analytics.trackBuildStyleSelected(this.el.buildStyle.value);
        });
        
        // API Key
        this.el.apiKey.addEventListener('blur', () => this.validateApiKey());
        this.el.apiKey.addEventListener('input', () => {
            this.hideError(this.el.apiKeyError);
            this.el.apiKey.classList.remove('error', 'success');
        });
        
        // File Upload
        this.el.fileInput.addEventListener('change', () => this.handleFileSelection());
        
        // Main Actions
        this.el.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        this.el.cancelBtn.addEventListener('click', () => this.handleCancel());
        this.el.demoBtn.addEventListener('click', () => this.runDemoMode());
        this.el.shareBtn.addEventListener('click', () => this.handleShare());
        this.el.priceCheckBtn.addEventListener('click', () => this.togglePriceChecker());
        this.el.searchTradeBtn.addEventListener('click', () => this.searchOnDiabloTrade());
        
        // Modals
        this.el.helpTrigger.addEventListener('click', () => this.openHelpModal());
        this.el.modalCloseBtn.addEventListener('click', () => this.closeHelpModal());
        this.el.helpModal.addEventListener('click', (e) => {
            if (e.target === this.el.helpModal) this.closeHelpModal();
        });
        
        this.el.privacyBtn.addEventListener('click', () => {
            this.el.privacyModal.style.display = 'flex';
            Analytics.trackPrivacyViewed();
        });
        this.el.privacyCloseBtn.addEventListener('click', () => {
            this.el.privacyModal.style.display = 'none';
        });
        
        // Price Reports
        this.el.reportPriceBtn.addEventListener('click', () => this.openPriceReportModal());
        this.el.priceReportCloseBtn.addEventListener('click', () => this.closePriceReportModal());
        this.el.priceReportForm.addEventListener('submit', (e) => this.handlePriceReport(e));
        this.el.refreshPriceBtn.addEventListener('click', () => this.refreshPriceData());
        
        // History
        this.el.clearHistory.addEventListener('click', () => this.clearHistory());
        
        // Online/Offline
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },
    
    // ====================================
    // MODEL MANAGEMENT
    // ====================================
    
    // ====================================
    // MODEL MANAGEMENT
    // ====================================
    
    initializeModel() {
        const provider = PROVIDERS.gemini;
        const recommended = provider.models.find(m => m.recommended);
        
        // Set the recommended (only) model
        if (recommended) {
            this.state.currentModel = recommended.id;
        }
        
        // Setup API key UI
        this.el.apiKey.placeholder = provider.keyPlaceholder;
        this.el.getKeyLink.href = provider.getKeyUrl;
        
        // Load API key for Gemini
        const savedKey = localStorage.getItem('api_key_gemini');
        this.el.apiKey.value = savedKey ? this.decrypt(savedKey) : '';
        
        // Clear validation state
        this.hideError(this.el.apiKeyError);
        this.el.apiKey.classList.remove('error', 'success');
    },
    
    // ====================================
    // VALIDATION
    // ====================================
    
    validateApiKey() {
        const key = this.el.apiKey.value.trim();
        
        if (!key) {
            this.el.apiKey.classList.remove('error', 'success');
            this.hideError(this.el.apiKeyError);
            return false;
        }
        
        const provider = PROVIDERS.gemini;
        const isValid = provider.keyPattern.test(key);
        
        if (!isValid) {
            this.el.apiKey.classList.add('error');
            this.el.apiKey.classList.remove('success');
            this.showError(this.el.apiKeyError, 'Invalid Gemini API key format');
            Analytics.trackApiKeyEntered('gemini', false);
            Analytics.trackApiKeyValidationError('gemini', 'invalid_format');
            Analytics.trackValidationError('api_key', 'invalid_format');
            return false;
        }
        
        this.el.apiKey.classList.remove('error');
        this.el.apiKey.classList.add('success');
        this.hideError(this.el.apiKeyError);
        this.showSuccess(this.el.apiKeySuccess, 'API key validated ✓');
        setTimeout(() => this.hideSuccess(this.el.apiKeySuccess), 2000);
        
        Analytics.trackApiKeyEntered('gemini', true);
        Analytics.trackConversionFunnel('api_key_validated', true);
        return true;
    },
    
    validateFile(file) {
        if (!file) {
            this.showError(this.el.imageError, 'Please select an image file');
            Analytics.trackImageUploadError('no_file', null, null);
            return false;
        }
        
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            this.showError(
                this.el.imageError,
                `File too large. Maximum size is ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
            );
            Analytics.trackImageUploadError('file_too_large', file.size, file.type);
            Analytics.trackValidationError('image_upload', 'file_too_large');
            return false;
        }
        
        if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
            this.showError(
                this.el.imageError,
                'Invalid file type. Please upload PNG, JPEG, or WebP'
            );
            Analytics.trackImageUploadError('invalid_type', file.size, file.type);
            Analytics.trackValidationError('image_upload', 'invalid_type');
            return false;
        }
        
        this.hideError(this.el.imageError);
        Analytics.trackConversionFunnel('image_validated', true);
        return true;
    },
    
    // ====================================
    // FILE HANDLING
    // ====================================
    
    handleFileSelection() {
        const file = this.el.fileInput.files[0];
        
        if (!file) {
            this.el.preview.style.display = 'none';
            this.hideSuccess(this.el.imageSuccess);
            this.hideError(this.el.imageError);
            return;
        }
        
        if (!this.validateFile(file)) {
            this.el.fileInput.value = '';
            this.el.preview.style.display = 'none';
            return;
        }
        
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        this.showSuccess(this.el.imageSuccess, `✓ Selected: ${file.name} (${fileSizeMB}MB)`);
        
        Analytics.trackImageSelected(file.size, file.type);
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.el.preview.src = e.target.result;
                this.el.preview.style.display = 'block';
                console.log('Image preview loaded successfully');
            } catch (err) {
                console.error('Error displaying preview:', err);
                this.showError(this.el.imageError, 'Failed to display preview');
            }
        };
        reader.onerror = () => {
            console.error('FileReader error:', reader.error);
            this.showError(this.el.imageError, 'Failed to read file. Please try again.');
            this.el.fileInput.value = '';
        };
        reader.readAsDataURL(file);
    },
    
    async compressImage(file) {
        const originalSize = file.size;
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    
                    // Resize if needed
                    if (width > CONFIG.MAX_DIMENSION || height > CONFIG.MAX_DIMENSION) {
                        if (width > height) {
                            height = (height / width) * CONFIG.MAX_DIMENSION;
                            width = CONFIG.MAX_DIMENSION;
                        } else {
                            width = (width / height) * CONFIG.MAX_DIMENSION;
                            height = CONFIG.MAX_DIMENSION;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        const compressedSize = blob.size;
                        const compressionRatio = compressedSize / originalSize;
                        
                        // Track compression performance
                        Analytics.trackImageCompression(originalSize, compressedSize, compressionRatio);
                        
                        resolve(blob);
                    }, 'image/jpeg', CONFIG.COMPRESSION_QUALITY);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },
    
    // ====================================
    // MAIN ANALYSIS FLOW
    // ====================================
    
    async handleAnalyze() {
        const key = this.el.apiKey.value.trim();
        const file = this.el.fileInput.files[0];
        
        // Validate inputs with clear error messages
        if (!key) {
            this.showError(this.el.apiKeyError, 'Please enter your Gemini API key');
            this.el.apiKey.focus();
            return;
        }
        
        if (!this.validateApiKey()) {
            this.el.apiKey.focus();
            return;
        }
        
        if (!file) {
            this.showError(this.el.imageError, 'Please select an image file');
            this.el.fileInput.focus();
            return;
        }
        
        if (!this.validateFile(file)) {
            this.el.fileInput.focus();
            return;
        }
        
        this.saveSettings();
        this.resetResults();
        this.setLoadingState(true);
        
        this.state.analysisStartTime = Date.now();
        this.state.abortController = new AbortController();
        
        const model = this.state.currentModel;
        const playerClass = this.el.playerClass.value;
        
        console.log('Starting analysis with model:', model);
        Analytics.trackAnalysisStarted('gemini', model, file.size, playerClass);
        
        try {
            // Compress image
            this.updateProgress(30, 'Compressing image...');
            const compressed = await this.compressImage(file);
            console.log('Image compressed');
            
            this.updateProgress(50, 'Encoding image...');
            const base64 = await this.fileToBase64(compressed);
            console.log('Image encoded to base64');
            
            this.updateProgress(70, 'Analyzing item...');
            
            // Call Gemini API
            const responseText = await this.analyzeWithGemini(key, base64, model);
            console.log('Received response from Gemini');
            
            if (!responseText) {
                throw new Error('Empty response from Gemini API');
            }
            
            this.updateProgress(100, 'Complete!');
            
            const duration = (Date.now() - this.state.analysisStartTime) / 1000;
            const { displayText, rarity, tradeQuery } = this.parseResponse(responseText);
            
            // Update session cost
            const modelData = PROVIDERS.gemini.models.find(m => m.id === model);
            const cost = modelData.estimatedCostPerScan;
            this.updateSessionCost(cost);
            
            // Display results
            this.displayResults(displayText, rarity, tradeQuery);
            this.saveToHistory(displayText, rarity, tradeQuery, cost);
            
            console.log('Analysis completed successfully');
            Analytics.trackAnalysisCompleted('gemini', model, duration, rarity, cost);
            
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.handleAnalysisError(error);
                const duration = (Date.now() - this.state.analysisStartTime) / 1000;
                Analytics.trackAnalysisFailed('gemini', model, error.name, error.message);
            } else {
                const duration = (Date.now() - this.state.analysisStartTime) / 1000;
                Analytics.trackAnalysisCancelled('gemini', model, duration);
            }
        } finally {
            this.setLoadingState(false);
            this.resetProgress();
        }
    },
    
    handleCancel() {
        if (this.state.abortController) {
            this.state.abortController.abort();
            this.state.abortController = null;
        }
    },
    
    // ====================================
    // GEMINI API CALL
    // ====================================
    
    async analyzeWithGemini(apiKey, base64, model) {
        const buildStyle = this.el.buildStyle.value;
        const prompt = PROMPT_TEMPLATES.base(this.el.playerClass.value, buildStyle);
        const provider = PROVIDERS.gemini;
        const requestStart = Date.now();
        
        const response = await fetch(
            `${provider.endpoint}${model}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: 'image/jpeg', data: base64 } }
                        ]
                    }]
                }),
                signal: this.state.abortController.signal
            }
        );
        
        const responseTime = Date.now() - requestStart;
        Analytics.trackAPIResponseTime('gemini', responseTime);
        
        await this.handleAPIResponse(response, 'Gemini');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    },
    
    async handleAPIResponse(response, providerName) {
        if (!response.ok) {
            const errorMessages = {
                400: 'Invalid request format. Please check your inputs.',
                401: 'Invalid API key. Please verify your key.',
                403: 'API key lacks necessary permissions.',
                429: `Rate limit exceeded on ${providerName}. Please wait a moment.`,
                500: `${providerName} API temporarily unavailable. Please try again.`,
                503: `${providerName} service unavailable. Please try again later.`
            };
            
            const message = errorMessages[response.status] || `API Error (${response.status})`;
            throw new Error(message);
        }
    },
    
    // ====================================
    // RESPONSE PARSING
    // ====================================
    
    parseResponse(text) {
        const parts = text.split(CONFIG.JSON_DELIMITER);
        let displayText = parts[0].trim();
        let rarity = '';
        let tradeQuery = '';
        
        if (parts[1]) {
            try {
                let jsonStr = parts[1].replace(/```json|```/g, '').trim();
                const metadata = JSON.parse(jsonStr);
                
                if (metadata.rarity && CONFIG.VALID_RARITIES.includes(metadata.rarity.toLowerCase())) {
                    rarity = `rarity-${metadata.rarity.toLowerCase()}`;
                }
                
                tradeQuery = metadata.trade_query || '';
            } catch (e) {
                console.warn('Failed to parse metadata:', e);
            }
        }
        
        return { displayText, rarity, tradeQuery };
    },
    
    // ====================================
    // DISPLAY RESULTS
    // ====================================
    
    displayResults(text, rarity, tradeQuery) {
        const sanitized = this.escapeHTML(text);
        
        // Format markdown bold and preserve line breaks
        let formatted = sanitized.replace(/\n/g, '<br>');
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        this.el.resultArea.innerHTML = formatted;
        this.el.resultArea.className = rarity;
        this.el.resultArea.style.display = 'block';
        this.el.actionButtons.classList.remove('hidden');
        
        this.state.currentAnalysis = text;
        this.state.currentRarity = rarity;
        
        // Extract item name
        const nameMatch = text.match(/\*\*(.*?)\*\*/);
        this.state.currentItemName = nameMatch ? nameMatch[1] : tradeQuery;
        
        // Show price checker button
        this.el.priceCheckBtn.classList.remove('hidden');
        
        // Track results viewed
        const timeToView = (Date.now() - this.state.analysisStartTime) / 1000;
        Analytics.trackResultsViewed(rarity, timeToView);
        
        // Scroll to results
        this.el.resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Track successful conversion funnel
        Analytics.trackConversionFunnel('results_displayed', true);
    },
    
    // ====================================
    // DEMO MODE
    // ====================================
    
    runDemoMode() {
        const provider = PROVIDERS.gemini;
        const demoData = provider.demoItem;
        
        Analytics.trackDemoModeActivated('gemini');
        
        const demoStartTime = Date.now();
        
        // Show demo image from actual file
        this.el.preview.src = demoData.imageUrl;
        this.el.preview.style.display = 'block';
        
        // Set class if relevant
        if (demoData.bestFor) {
            this.el.playerClass.value = demoData.bestFor[0] || 'Any';
        }
        
        // Simulate loading
        this.setLoadingState(true);
        this.updateProgress(30, 'Analyzing demo item...');
        
        setTimeout(() => {
            this.updateProgress(70, 'Almost done...');
        }, 500);
        
        setTimeout(() => {
            this.updateProgress(100, 'Complete!');
            
            const rarity = `rarity-${demoData.rarity}`;
            this.displayResults(demoData.analysis, rarity, demoData.name);
            
            // Show price if available
            const priceData = PriceDatabase.searchItem(demoData.name);
            if (priceData) {
                this.displayPriceData(priceData);
                this.el.priceSection.classList.remove('hidden');
            }
            
            this.setLoadingState(false);
            this.resetProgress();
            
            // Track demo completion
            const demoTimeSpent = Math.round((Date.now() - demoStartTime) / 1000);
            Analytics.trackDemoCompleted('gemini', demoTimeSpent);
        }, 1500);
    },
    
    // ====================================
    // PRICE CHECKER
    // ====================================
    
    togglePriceChecker() {
        if (!this.state.currentItemName) return;
        
        const isVisible = !this.el.priceSection.classList.contains('hidden');
        
        if (isVisible) {
            this.el.priceSection.classList.add('hidden');
        } else {
            const priceData = PriceDatabase.searchItem(this.state.currentItemName);
            
            if (priceData) {
                this.displayPriceData(priceData);
                this.el.priceSection.classList.remove('hidden');
                
                Analytics.trackPriceCheckToggled(
                    this.state.currentItemName,
                    this.state.currentRarity,
                    true
                );
                
                Analytics.trackPriceDataViewed(
                    priceData.name,
                    'static_database',
                    priceData.tradeValue
                );
            } else {
                this.el.priceContent.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #999;">
                        <p>No price data available for this item yet.</p>
                        <p style="font-size: 0.85rem; margin-top: 10px;">
                            Help us build the database by reporting prices!
                        </p>
                    </div>
                `;
                this.el.priceSection.classList.remove('hidden');
                this.el.viewTradeBtn.classList.add('hidden');
                
                Analytics.trackPriceCheckToggled(
                    this.state.currentItemName,
                    this.state.currentRarity,
                    false
                );
            }
        }
    },
    
    displayPriceData(priceData) {
        const demandColor = PriceDatabase.getDemandColor(priceData.demand);
        const demandLabel = PriceDatabase.getDemandLabel(priceData.demand);
        const valueTier = PriceDatabase.getValueTier(priceData.tradeValue);
        
        this.el.priceContent.innerHTML = `
            <div class="price-row">
                <span>Trade Value:</span>
                <span class="price-value-${valueTier}">${priceData.tradeValue}</span>
            </div>
            <div class="price-row">
                <span>Est. Price:</span>
                <span>${priceData.estimatedPrice}</span>
            </div>
            <div class="price-row">
                <span>Demand:</span>
                <span style="color: ${demandColor};">${demandLabel}</span>
            </div>
            <div class="price-row">
                <span>Best For:</span>
                <span>${priceData.bestFor ? priceData.bestFor.join(', ') : 'All Classes'}</span>
            </div>
            ${priceData.notes ? `
                <div style="margin-top: 10px; padding: 10px; background: #252525; border-radius: 4px; font-size: 0.85rem; color: #ccc;">
                    <strong>Note:</strong> ${priceData.notes}
                </div>
            ` : ''}
            <div class="price-updated">Last updated: ${PriceDatabase.lastUpdated}</div>
        `;
        
        // Always show trade link button (not just for high value items)
        this.el.viewTradeBtn.classList.remove('hidden');
        this.el.viewTradeBtn.onclick = () => {
            window.open(DiabloTradeAPI.getSearchUrl(priceData.name), '_blank');
            Analytics.trackViewTradeClicked(priceData.name);
        };
    },
    
    refreshPriceData() {
        if (!this.state.currentItemName) return;
        
        const priceData = PriceDatabase.searchItem(this.state.currentItemName);
        if (priceData) {
            this.displayPriceData(priceData);
            this.showSuccess(this.el.imageSuccess, 'Price data refreshed');
            setTimeout(() => this.hideSuccess(this.el.imageSuccess), 2000);
        }
        
        Analytics.trackPriceRefreshed(this.state.currentItemName);
    },
    
    openPriceReportModal() {
        this.el.priceReportModal.style.display = 'flex';
        document.getElementById('observed-price').value = '';
        document.getElementById('price-source').value = '';
        document.getElementById('price-notes').value = '';
    },
    
    closePriceReportModal() {
        this.el.priceReportModal.style.display = 'none';
    },
    
    handlePriceReport(e) {
        e.preventDefault();
        
        const observedPrice = document.getElementById('observed-price').value;
        const source = document.getElementById('price-source').value;
        const notes = document.getElementById('price-notes').value;
        
        CrowdsourcedPricing.submitReport(
            this.state.currentItemName,
            observedPrice,
            source,
            notes
        );
        
        this.closePriceReportModal();
        this.showSuccess(this.el.imageSuccess, 'Thank you! Price report submitted.');
        setTimeout(() => this.hideSuccess(this.el.imageSuccess), 3000);
    },
    
    // ====================================
    // HISTORY MANAGEMENT
    // ====================================
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('horadric_history');
            if (saved) {
                this.state.history = JSON.parse(saved).slice(0, CONFIG.MAX_HISTORY);
                
                // 🔥 MIGRATION: Update old history items with missing fields
                let needsMigration = false;
                this.state.history = this.state.history.map(item => {
                    // Skip if already has verdict and price
                    if (item.verdict && item.marketPrice) {
                        return item;
                    }
                    
                    needsMigration = true;
                    
                    // Extract verdict from text if missing
                    if (!item.verdict && item.text) {
                        const verdictMatch = item.text.match(/\*\*Verdict:\*\*\s*(KEEP|SALVAGE)/i);
                        if (verdictMatch) {
                            item.verdict = verdictMatch[1].toUpperCase();
                        }
                    }
                    
                    // Get market price if missing
                    if (!item.marketPrice && item.title) {
                        // Try community pricing first
                        if (typeof CommunityPricing !== 'undefined') {
                            const communityData = CommunityPricing.getAveragePrice(item.title);
                            if (communityData && communityData.sampleSize >= 3) {
                                item.marketPrice = communityData.avgPrice;
                                item.priceSource = 'community';
                            }
                        }
                        
                        // Fallback to static database
                        if (!item.marketPrice && typeof PriceDatabase !== 'undefined') {
                            const priceData = PriceDatabase.searchItem(item.title);
                            if (priceData) {
                                item.marketPrice = priceData.tradeValue;
                                item.priceSource = 'database';
                            }
                        }
                    }
                    
                    return item;
                });
                
                // Save migrated history back to localStorage
                if (needsMigration) {
                    try {
                        localStorage.setItem('horadric_history', JSON.stringify(this.state.history));
                        console.log('✅ History migrated with verdict and price data');
                    } catch (e) {
                        console.warn('Failed to save migrated history:', e);
                    }
                }
                
                this.renderHistory();
            }
        } catch (e) {
            console.warn('Failed to load history:', e);
        }
    },
    
    saveToHistory(text, rarity, tradeQuery, cost) {
        const title = (text.match(/\*\*(.*?)\*\*/)?.[1] || 'Item').substring(0, 100);
        
        // Extract verdict (KEEP or SALVAGE)
        const verdictMatch = text.match(/\*\*Verdict:\*\*\s*(KEEP|SALVAGE)/i);
        const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : null;
        
        // 🔥 HYBRID PRICING: Community → Static → None
        let marketPrice = null;
        let priceSource = null;
        
        // Try community pricing first (if 3+ reports)
        if (typeof CommunityPricing !== 'undefined') {
            const communityData = CommunityPricing.getAveragePrice(title);
            if (communityData && communityData.sampleSize >= 3) {
                marketPrice = communityData.avgPrice;
                priceSource = 'community';
            }
        }
        
        // Fallback to static database
        if (!marketPrice) {
            const priceData = PriceDatabase.searchItem(title);
            if (priceData) {
                marketPrice = priceData.tradeValue;
                priceSource = 'database';
            }
        }
        
        const item = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            title,
            text: text.substring(0, 5000),
            rarity,
            tradeQuery,
            playerClass: this.el.playerClass.value,
            buildStyle: this.el.buildStyle.value,
            provider: 'gemini',
            model: this.state.currentModel,
            cost: cost,
            verdict: verdict,
            marketPrice: marketPrice,
            priceSource: priceSource
        };
        
        this.state.history.unshift(item);
        this.state.history = this.state.history.slice(0, CONFIG.MAX_HISTORY);
        
        try {
            localStorage.setItem('horadric_history', JSON.stringify(this.state.history));
            this.renderHistory();
        } catch (e) {
            console.warn('Failed to save history:', e);
        }
    },
    
    renderHistory() {
        if (this.state.history.length === 0) {
            this.el.historySection.style.display = 'none';
            return;
        }
        
        this.el.historySection.style.display = 'block';
        this.el.historyList.innerHTML = '';
        
        this.state.history.forEach(item => {
            const div = document.createElement('div');
            div.className = `history-item ${item.rarity || ''}`;
            div.setAttribute('role', 'listitem');
            div.setAttribute('tabindex', '0');
            
            // Build verdict badge
            let verdictBadge = '';
            if (item.verdict) {
                const verdictColor = item.verdict === 'KEEP' ? '#4caf50' : '#ff9800';
                verdictBadge = `<span style="font-size: 0.75rem; color: ${verdictColor}; font-weight: bold;">${item.verdict}</span>`;
            }
            
            // Build market price display with icon and source indicator
            let priceDisplay = '';
            if (item.marketPrice) {
                // Add small indicator for price source
                const sourceIcon = item.priceSource === 'community' ? '👥' : '';
                const sourceTitle = item.priceSource === 'community' 
                    ? 'Community-sourced price' 
                    : 'Database price';
                
                priceDisplay = `<span style="font-size: 0.75rem; color: #888;" title="${sourceTitle}">💰 ${item.marketPrice} ${sourceIcon}</span>`;
            }
            
            // Build style indicator
            let buildBadge = '';
            if (item.buildStyle) {
                const buildEmojis = {
                    'damage': '🗡️',
                    'tanky': '🛡️',
                    'speed': '⚡',
                    'dots': '🔥',
                    'crit': '💥',
                    'minions': '👥',
                    'cooldown': '⏱️',
                    'lucky-hit': '🎯',
                    'crowd-control': '❄️',
                    'resource': '💧'
                };
                const emoji = buildEmojis[item.buildStyle] || '';
                buildBadge = emoji ? ` ${emoji}` : '';
            }
            
            div.innerHTML = `
                <div class="history-header">
                    <span>${item.date}</span>
                    <span>${item.playerClass || 'Any'}${buildBadge}</span>
                </div>
                <div class="history-name">${this.escapeHTML(item.title)}</div>
                <div style="margin-top: 5px; display: flex; justify-content: space-between; align-items: center;">
                    ${verdictBadge}
                    ${priceDisplay}
                </div>
            `;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'history-delete';
            deleteBtn.textContent = '×';
            deleteBtn.setAttribute('aria-label', `Delete ${item.title}`);
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(item.id);
            };
            div.appendChild(deleteBtn);
            
            div.onclick = () => {
                this.displayResults(item.text, item.rarity, item.tradeQuery);
                this.state.currentItemName = item.title;
                window.scrollTo({ top: 200, behavior: 'smooth' });
                
                const age = Math.floor((Date.now() - item.id) / (1000 * 60 * 60 * 24));
                Analytics.trackHistoryItemClicked(item.rarity, age);
            };
            
            this.el.historyList.appendChild(div);
        });
        
        Analytics.trackHistoryViewed(this.state.history.length);
    },
    
    deleteHistoryItem(id) {
        const item = this.state.history.find(h => h.id === id);
        
        this.state.history = this.state.history.filter(h => h.id !== id);
        
        try {
            localStorage.setItem('horadric_history', JSON.stringify(this.state.history));
            this.renderHistory();
        } catch (e) {
            console.warn('Failed to delete history item:', e);
        }
        
        if (item) {
            Analytics.trackHistoryItemDeleted(item.rarity);
        }
    },
    
    clearHistory() {
        if (!confirm('Clear all history? This cannot be undone.')) return;
        
        const count = this.state.history.length;
        this.state.history = [];
        
        try {
            localStorage.removeItem('horadric_history');
            this.renderHistory();
        } catch (e) {
            console.warn('Failed to clear history:', e);
        }
        
        Analytics.trackHistoryCleared(count);
    },
    
    // ====================================
    // SESSION COST TRACKING
    // ====================================
    
    loadSessionCost() {
        try {
            const saved = sessionStorage.getItem(CONFIG.SESSION_COST_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.state.sessionCost = data.cost || 0;
                this.state.sessionScans = data.scans || 0;
            }
        } catch (e) {
            console.warn('Failed to load session cost:', e);
        }
    },
    
    updateSessionCost(scanCost) {
        this.state.sessionCost += scanCost;
        this.state.sessionScans += 1;
        
        try {
            sessionStorage.setItem(CONFIG.SESSION_COST_KEY, JSON.stringify({
                cost: this.state.sessionCost,
                scans: this.state.sessionScans
            }));
        } catch (e) {
            console.warn('Failed to save session cost:', e);
        }
        
        Analytics.trackCostCalculated(
            'gemini',
            this.state.currentModel,
            scanCost,
            this.state.sessionScans
        );
        
        if (this.state.sessionScans % 5 === 0) {
            const avgCost = this.state.sessionCost / this.state.sessionScans;
            Analytics.trackSessionCostSummary(
                this.state.sessionScans,
                this.state.sessionCost,
                avgCost
            );
        }
    },
    
    // ====================================
    // MODALS
    // ====================================
    
    openHelpModal() {
        this.state.helpModalOpenTime = Date.now();
        this.updateHelpModal();
        this.el.helpModal.style.display = 'flex';
        Analytics.trackHelpOpened('gemini');
    },
    
    closeHelpModal() {
        this.el.helpModal.style.display = 'none';
        
        if (this.state.helpModalOpenTime) {
            const timeOpen = Math.round((Date.now() - this.state.helpModalOpenTime) / 1000);
            Analytics.trackHelpClosed(timeOpen);
            this.state.helpModalOpenTime = null;
        }
    },
    
    updateHelpModal() {
        const provider = PROVIDERS.gemini;
        const help = provider.help;
        
        let html = `<h3>${help.title}</h3><ol>`;
        help.steps.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += `</ol>`;
        
        if (help.note) {
            html += `<div style="margin-top: 15px; font-size: 0.85rem; color: #888; border-top: 1px solid #444; padding-top: 10px;">
                <em>${help.note}</em>
            </div>`;
        }
        
        this.el.modalContent.innerHTML = html;
    },
    
    // ====================================
    // UI STATE MANAGEMENT
    // ====================================
    
    setLoadingState(loading) {
        this.el.loading.style.display = loading ? 'block' : 'none';
        this.el.analyzeBtn.disabled = loading;
        this.el.analyzeBtn.textContent = loading ? 'Analyzing...' : 'Identify Item';
        this.el.cancelBtn.classList.toggle('hidden', !loading);
    },
    
    updateProgress(percent, message) {
        this.el.progressContainer.classList.add('show');
        this.el.progressBar.style.width = `${percent}%`;
        
        if (message) {
            this.el.loading.querySelector('.loading-text').textContent = message;
        }
    },
    
    resetProgress() {
        setTimeout(() => {
            this.el.progressContainer.classList.remove('show');
            this.el.progressBar.style.width = '0%';
        }, 500);
    },
    
    resetResults() {
        this.el.resultArea.className = '';
        this.el.resultArea.innerHTML = '';
        this.el.resultArea.style.display = 'none';
        this.el.actionButtons.classList.add('hidden');
        this.el.priceSection.classList.add('hidden');
        
        this.hideError(this.el.imageError);
        this.hideError(this.el.apiKeyError);
        
        this.state.currentAnalysis = null;
        this.state.currentItemName = null;
        this.state.currentRarity = null;
    },
    
    // ====================================
    // DIABLO.TRADE SEARCH
    // ====================================
    
    searchOnDiabloTrade() {
        if (!this.state.currentItemName) return;
        
        const searchUrl = DiabloTradeAPI.getSearchUrl(this.state.currentItemName);
        window.open(searchUrl, '_blank');
        
        Analytics.trackViewTradeClicked(this.state.currentItemName);
    },
    
    // ====================================
    // SHARING
    // ====================================
    
    handleShare() {
        if (!this.state.currentAnalysis) return;
        
        const text = `**[Horadric AI Analysis]**\n${this.state.currentAnalysis}\n\n*Analyzed with Google Gemini via Horadric AI*`;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.el.shareBtn.textContent;
            this.el.shareBtn.textContent = '✅ Copied!';
            
            setTimeout(() => {
                this.el.shareBtn.textContent = originalText;
            }, 2000);
            
            Analytics.trackShareDiscord(this.state.currentRarity, 'gemini');
        }).catch(err => {
            console.error('Copy failed:', err);
            this.showError(this.el.imageError, 'Failed to copy. Please select text manually.');
        });
    },
    
    // ====================================
    // ERROR HANDLING
    // ====================================
    
    handleAnalysisError(error) {
        console.error('Analysis error:', error);
        
        let errorMsg = error.message || 'An unexpected error occurred. Please try again.';
        
        this.el.resultArea.textContent = `⚠️ ${errorMsg}`;
        this.el.resultArea.classList.add('error-state');
        this.el.resultArea.style.display = 'block';
        
        Analytics.trackError('analysis_error', error.message, 'gemini');
    },
    
    // ====================================
    // ONLINE/OFFLINE STATUS
    // ====================================
    
    checkOnlineStatus() {
        if (!navigator.onLine) {
            this.el.offlineBanner.classList.add('show');
        }
    },
    
    handleOnline() {
        this.el.offlineBanner.classList.remove('show');
    },
    
    handleOffline() {
        this.el.offlineBanner.classList.add('show');
    },
    
    // ====================================
    // FIRST VISIT & ONBOARDING
    // ====================================
    
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('horadric_visited');
        
        if (!hasVisited) {
            setTimeout(() => {
                Analytics.trackMilestone('first_visit', {
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('horadric_visited', 'true');
            }, 2000);
        }
    },
    
    // ====================================
    // KEYBOARD SHORTCUTS
    // ====================================
    
    handleKeyboard(e) {
        // Escape: Close modals
        if (e.key === 'Escape') {
            if (this.el.helpModal.style.display === 'flex') {
                this.closeHelpModal();
            }
            if (this.el.privacyModal.style.display === 'flex') {
                this.el.privacyModal.style.display = 'none';
            }
            if (this.el.priceReportModal.style.display === 'flex') {
                this.closePriceReportModal();
            }
        }
        
        // Ctrl/Cmd + Enter: Analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!this.el.analyzeBtn.disabled) {
                this.handleAnalyze();
            }
        }
    },
    
    // ====================================
    // UTILITY FUNCTIONS
    // ====================================
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    encrypt(text) {
        return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, 
            (_, p1) => String.fromCharCode('0x' + p1)));
    },
    
    decrypt(text) {
        try {
            return decodeURIComponent(atob(text).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        } catch {
            return text;
        }
    },
    
    async fileToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    resolve(reader.result.split(',')[1]);
                } catch (e) {
                    reject(new Error('Failed to process image'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(blob);
        });
    },
    
    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    },
    
    hideError(element) {
        element.textContent = '';
        element.classList.remove('show');
    },
    
    showSuccess(element, message) {
        element.textContent = message;
        element.classList.add('show');
    },
    
    hideSuccess(element) {
        element.textContent = '';
        element.classList.remove('show');
    }
};

// ====================================
// INITIALIZE APPLICATION
// ====================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HoradricApp.init());
} else {
    HoradricApp.init();
}
