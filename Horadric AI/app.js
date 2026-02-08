// ====================================
// HORADRIC AI - APP ENGINE
// Version: 2.0.0 (Analyze + Compare Dual Mode)
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null,
        mode: 'analyze' // 'analyze' or 'compare'
    },
    
    el: {}, 
    
    init() {
        this.cacheElements();
        this.loadState();
        this.attachEventListeners();
        this.updateClassOptions();
        this.syncModeUI();
        console.log('👁️ Horadric Eye Opened (Gemini 2.5 Flash Active)');
    },
    
    cacheElements() {
        // Core Inputs
        this.el.playerClass = document.getElementById('player-class');
        this.el.buildStyle = document.getElementById('build-style');
        this.el.apiKey = document.getElementById('api-key');
        
        // Image Upload (single zone for both modes)
        this.el.imageUpload = document.getElementById('image-upload');
        this.el.imagePreview = document.getElementById('image-preview');
        this.el.uploadZone = document.getElementById('upload-group');
        this.el.uploadLabel = document.getElementById('upload-label');
        this.el.uploadHint = document.getElementById('upload-hint');
        this.el.imageError = document.getElementById('image-error');

        // Advanced Inputs
        this.el.toggleAdvanced = document.getElementById('toggle-advanced');
        this.el.advancedPanel = document.getElementById('advanced-panel');
        this.el.keyMechanic = document.getElementById('key-mechanic');
        
        // Stat Checkboxes
        this.el.needsStr = document.getElementById('need-str');
        this.el.needsInt = document.getElementById('need-int');
        this.el.needsWill = document.getElementById('need-will');
        this.el.needsDex = document.getElementById('need-dex');
        this.el.needsRes = document.getElementById('need-res');

        // UI Zones
        this.el.resultArea = document.getElementById('result-area');
        this.el.loading = document.getElementById('loading');
        
        // Mode Buttons
        this.el.modeAnalyze = document.getElementById('mode-analyze');
        this.el.modeCompare = document.getElementById('mode-compare');
        
        // Action Buttons
        this.el.analyzeBtn = document.getElementById('analyze-btn');
        this.el.compareBtn = document.getElementById('compare-btn');
        this.el.demoBtn = document.getElementById('demo-btn');
        this.el.helpTrigger = document.getElementById('help-trigger');

        // Modals
        this.el.helpModal = document.getElementById('help-modal');
        this.el.modalClose = document.getElementById('modal-close-btn');
        this.el.modalContent = document.getElementById('modal-content-dynamic');
    },

    attachEventListeners() {
        // Class/Build dropdowns
        if (this.el.playerClass) this.el.playerClass.addEventListener('change', () => this.updateBuildOptions());
        
        // Image upload
        if (this.el.imageUpload) this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Mode toggle
        if (this.el.modeAnalyze) this.el.modeAnalyze.addEventListener('click', () => this.setMode('analyze'));
        if (this.el.modeCompare) this.el.modeCompare.addEventListener('click', () => this.setMode('compare'));
        
        // Advanced toggle
        if (this.el.toggleAdvanced) this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());

        // Action buttons
        if (this.el.analyzeBtn) this.el.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        if (this.el.compareBtn) this.el.compareBtn.addEventListener('click', () => this.handleCompare());
        if (this.el.demoBtn) this.el.demoBtn.addEventListener('click', () => this.runDemo());

        // Help Modal
        if (this.el.helpTrigger) {
            this.el.helpTrigger.addEventListener('click', () => {
                this.populateHelpContent();
                this.el.helpModal.style.display = 'flex';
            });
        }
        if (this.el.modalClose) {
            this.el.modalClose.addEventListener('click', () => {
                this.el.helpModal.style.display = 'none';
            });
        }
        window.addEventListener('click', (e) => {
            if (e.target === this.el.helpModal) {
                this.el.helpModal.style.display = 'none';
            }
        });
        
        // Drag/Drop
        if (this.el.uploadZone) this.setupDragDrop();
        
        // API Key
        if (this.el.apiKey) this.el.apiKey.addEventListener('change', () => this.saveApiKey());
    },

    // ====================================
    // MODE MANAGEMENT
    // ====================================
    setMode(mode) {
        this.state.mode = mode;
        this.syncModeUI();
        this.clearResults();
    },

    syncModeUI() {
        const isCompare = this.state.mode === 'compare';

        // Toggle active state on mode buttons
        if (this.el.modeAnalyze) this.el.modeAnalyze.classList.toggle('active', !isCompare);
        if (this.el.modeCompare) this.el.modeCompare.classList.toggle('active', isCompare);

        // Show/hide the correct action button
        if (this.el.analyzeBtn) this.el.analyzeBtn.style.display = isCompare ? 'none' : 'block';
        if (this.el.compareBtn) this.el.compareBtn.style.display = isCompare ? 'block' : 'none';

        // Update upload label and hint based on mode
        if (this.el.uploadLabel) {
            this.el.uploadLabel.textContent = isCompare ? 'Upload Comparison Screenshot' : 'Upload Loot Screenshot';
        }
        if (this.el.uploadHint) {
            this.el.uploadHint.textContent = isCompare 
                ? 'Upload a single screenshot showing both items side by side' 
                : 'Max 10MB. Formats: PNG, JPEG, WebP';
        }
    },

    // ====================================
    // DRAG & DROP
    // ====================================
    setupDragDrop() {
        const zone = this.el.uploadZone;
        if (!zone) return;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
            zone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
        });
        zone.addEventListener('dragover', () => zone.classList.add('drag-over'));
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            zone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                if (this.el.imageUpload) this.el.imageUpload.files = e.dataTransfer.files;
                this.handleFileSelect({ target: { files: e.dataTransfer.files } });
            }
        });
    },

    // ====================================
    // CLASS / BUILD DROPDOWNS
    // ====================================
    updateClassOptions() {
        if (!CONFIG.CLASS_DEFINITIONS['d4'] || !this.el.playerClass) return;
        const classData = CONFIG.CLASS_DEFINITIONS['d4'];
        const classes = Object.keys(classData);
        const previousSelection = this.el.playerClass.value;
        
        this.el.playerClass.innerHTML = '<option value="Any">Select Class...</option>';
        classes.forEach(cls => {
            const opt = document.createElement('option');
            opt.value = cls;
            opt.textContent = cls;
            if (cls === previousSelection) opt.selected = true;
            this.el.playerClass.appendChild(opt);
        });
        this.updateBuildOptions();
    },

    updateBuildOptions() {
        if (!this.el.playerClass || !this.el.buildStyle) return;
        const cls = this.el.playerClass.value;
        
        if (!cls || cls === 'Any') {
            this.el.buildStyle.innerHTML = '<option value="">Any / General</option>';
            return;
        }

        const classDef = CONFIG.CLASS_DEFINITIONS['d4'][cls] || { builds: [] };
        this.el.buildStyle.innerHTML = '<option value="">Any / General</option>';
        if (classDef.builds) {
            classDef.builds.forEach(build => {
                const opt = document.createElement('option');
                opt.value = build;
                opt.textContent = build;
                this.el.buildStyle.appendChild(opt);
            });
        }
    },

    // ====================================
    // FILE SELECT
    // ====================================
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (this.el.imagePreview) {
                this.el.imagePreview.src = ev.target.result;
                this.el.imagePreview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
        if (this.el.imageError) this.el.imageError.style.display = 'none';
    },

    // ====================================
    // HELPERS: Get user context
    // ====================================
    getUserContext() {
        const pClass = (this.el.playerClass && this.el.playerClass.value !== 'Any') ? this.el.playerClass.value : 'Any';
        const build = (this.el.buildStyle && this.el.buildStyle.value) ? this.el.buildStyle.value : 'General';
        
        const advancedSettings = {
            mechanic: this.el.keyMechanic ? this.el.keyMechanic.value : '',
            needs: {
                str: this.el.needsStr ? this.el.needsStr.checked : false,
                int: this.el.needsInt ? this.el.needsInt.checked : false,
                will: this.el.needsWill ? this.el.needsWill.checked : false,
                dex: this.el.needsDex ? this.el.needsDex.checked : false,
                res: this.el.needsRes ? this.el.needsRes.checked : false
            }
        };

        return { pClass, build, advancedSettings };
    },

    getImageData(previewEl) {
        if (!previewEl || !previewEl.src || !previewEl.src.startsWith('data:')) return null;
        return {
            base64: previewEl.src.split(',')[1],
            mimeType: previewEl.src.split(';')[0].split(':')[1] || 'image/jpeg'
        };
    },

    ensureApiKey() {
        if (!this.state.apiKey) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                this.state.apiKey = atob(savedKey);
                if (this.el.apiKey) this.el.apiKey.value = this.state.apiKey;
            } else {
                alert('Please enter your Gemini API Key or try Demo Mode.');
                return false;
            }
        }
        return true;
    },

    // ====================================
    // ANALYZE MODE (Single Item)
    // ====================================
    async handleAnalyze() {
        if (!this.ensureApiKey()) return;
        
        const img = this.getImageData(this.el.imagePreview);
        if (!img) return alert('Please upload an item screenshot.');

        this.showLoading(true, 'Consulting Deckard Cain...');
        this.clearResults();

        try {
            // Stage 1: Detect
            const detectPrompt = PROMPT_TEMPLATES.detect();
            const detectResult = await this.callGemini(detectPrompt, img.base64, img.mimeType);
            
            if (!detectResult) throw new Error('AI Recognition Failed.');
            const category = (detectResult.category || detectResult.game || 'unknown').toLowerCase();

            if (category === 'not_loot') {
                this.renderRejection('Not a Game Item', 'This does not appear to be a Diablo 4 item tooltip. Please upload a direct screenshot of an item.');
                this.showLoading(false);
                return;
            }

            // Stage 2: Analyze
            this.showLoading(true, 'Analyzing Affixes...');
            const { pClass, build, advancedSettings } = this.getUserContext();
            const analyzePrompt = PROMPT_TEMPLATES.analyze(pClass, build, advancedSettings);
            const result = await this.callGemini(analyzePrompt, img.base64, img.mimeType);
            
            if (!result) throw new Error('Analysis failed. Please try again.');
            this.renderAnalyzeResult(result);

        } catch (error) {
            this.renderError(error.message);
        } finally {
            this.showLoading(false);
        }
    },

    // ====================================
    // COMPARE MODE (Two Items)
    // ====================================
    async handleCompare() {
        if (!this.ensureApiKey()) return;

        const img = this.getImageData(this.el.imagePreview);
        if (!img) return alert('Please upload a screenshot showing both items side by side.');

        this.showLoading(true, 'Comparing Items...');
        this.clearResults();

        try {
            // Stage 1: Detect (sanity check)
            const detectPrompt = PROMPT_TEMPLATES.detect();
            const detectResult = await this.callGemini(detectPrompt, img.base64, img.mimeType);
            
            if (!detectResult) throw new Error('AI Recognition Failed.');
            const category = (detectResult.category || detectResult.game || 'unknown').toLowerCase();
            if (category === 'not_loot') {
                this.renderRejection('Not a Game Item', 'This does not appear to be a Diablo 4 item tooltip. Please upload a screenshot showing both items.');
                this.showLoading(false);
                return;
            }

            // Stage 2: Compare (single image with both items)
            this.showLoading(true, 'Weighing Both Items...');
            const { pClass, build, advancedSettings } = this.getUserContext();
            const comparePrompt = PROMPT_TEMPLATES.compare(pClass, build, advancedSettings);
            const result = await this.callGemini(comparePrompt, img.base64, img.mimeType);
            
            if (!result) throw new Error('Comparison failed. Please try again.');
            this.renderCompareResult(result);

        } catch (error) {
            this.renderError(error.message);
        } finally {
            this.showLoading(false);
        }
    },

    // ====================================
    // GEMINI API CALLS
    // ====================================
    async callGemini(prompt, imageBase64, mimeType) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.state.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: mimeType, data: imageBase64 } }
                    ]
                }],
                generationConfig: {
                    response_mime_type: 'application/json',
                    temperature: 0.1
                }
            })
        });

        return this.parseGeminiResponse(response);
    },

    async parseGeminiResponse(response) {
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const msg = errData.error?.message || `Gemini API returned ${response.status}`;
            throw new Error(msg);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            if (data.candidates?.[0]?.finishReason === 'SAFETY') {
                throw new Error('Content was blocked by Gemini safety filters. Try a cleaner screenshot.');
            }
            throw new Error('Gemini returned an empty response. Try again or use a clearer screenshot.');
        }
        
        const rawText = data.candidates[0].content.parts[0].text;
        if (!rawText) throw new Error('Gemini returned empty text.');
        return this.safeJSONParse(rawText);
    },

    safeJSONParse(str) {
        try {
            return JSON.parse(str);
        } catch (_) {
            try {
                let clean = str.replace(/```json\s*/g, '').replace(/```/g, '').trim();
                const start = clean.indexOf('{');
                const end = clean.lastIndexOf('}');
                if (start === -1 || end === -1) return null;
                clean = clean.substring(start, end + 1);
                return JSON.parse(clean);
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Raw:', str.substring(0, 200));
                return null;
            }
        }
    },

    // ====================================
    // RENDER: Analyze Result (Single Item)
    // ====================================
    renderAnalyzeResult(result) {
        if (!this.el.resultArea) return;

        const verdictColor = (result.verdict || '').includes('KEEP') ? '#4caf50' : '#f44336';
        const scoreColor = { S: '#ffd700', A: '#4caf50', B: '#2196f3', C: '#ff9800', D: '#f44336' }[result.score?.[0]] || '#aaa';

        let affixHTML = '';
        if (Array.isArray(result.affixes)) {
            affixHTML = result.affixes.map(a => {
                const icon = a.quality === 'GOOD' ? '✅' : a.quality === 'BAD' ? '❌' : '➖';
                const color = a.quality === 'GOOD' ? '#4caf50' : a.quality === 'BAD' ? '#f44336' : '#ff9800';
                return `
                    <div style="display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid #2a2a2a;">
                        <span style="font-size:1.1em;">${icon}</span>
                        <div style="flex:1;">
                            <span style="color:${color}; font-weight:bold;">${a.name || ''}</span>
                            <span style="color:#888; margin-left:6px;">${a.value || ''}</span>
                            <div style="color:#999; font-size:0.85em; margin-top:2px;">${a.reason || ''}</div>
                        </div>
                    </div>`;
            }).join('');
        } else if (typeof result.analysis === 'string') {
            // Fallback for old-format responses
            affixHTML = `<div style="color:#ccc; line-height:1.8;">${result.analysis.replace(/\n/g, '<br>')}</div>`;
        }

        this.el.resultArea.innerHTML = `
            <div style="border-left: 4px solid #d4af37; padding: 15px; background: #1a1a1a; margin-top:10px; border-radius: 0 4px 4px 0;">
                <h2 style="color:#d4af37; margin-top:0;">${result.title || 'Item'}</h2>
                <div style="display:flex; gap:12px; flex-wrap:wrap; margin:8px 0; align-items:center;">
                    <span style="color:#aaa;">${result.type || ''}</span>
                    <span style="color:#b388ff;">${result.rarity || ''}</span>
                    ${result.item_power ? `<span style="color:#fff; background:#333; padding:2px 8px; border-radius:3px; font-size:0.85em;">⚡ ${result.item_power}</span>` : ''}
                </div>
                <div style="display:flex; gap:12px; align-items:center; margin:12px 0;">
                    <span style="font-weight:bold; color:${verdictColor}; font-size:1.2em;">${result.verdict || ''}</span>
                    <span style="color:${scoreColor}; font-weight:bold; font-size:1.1em;">${result.score || ''}</span>
                </div>
                <div style="color:#ccc; font-style:italic; margin:10px 0; line-height:1.5;">${result.insight || ''}</div>
                <hr style="border-color:#333; margin:15px 0;">
                <div style="font-weight:bold; color:#888; margin-bottom:8px; font-size:0.85em; text-transform:uppercase;">Affix Breakdown</div>
                ${affixHTML}
            </div>
        `;
        this.el.resultArea.style.display = 'block';
    },

    // ====================================
    // RENDER: Compare Result (Two Items)
    // ====================================
    renderCompareResult(result) {
        if (!this.el.resultArea) return;

        const winner = result.winner === '1' ? 'Item 1' : 'Item 2';
        const winnerItem = result.winner === '1' ? result.item_1 : result.item_2;
        const loserItem = result.winner === '1' ? result.item_2 : result.item_1;

        const renderItemColumn = (item, label, isWinner) => {
            const borderColor = isWinner ? '#4caf50' : '#f44336';
            const badge = isWinner 
                ? '<span style="background:#4caf50; color:#fff; padding:2px 8px; border-radius:3px; font-size:0.8em; font-weight:bold;">EQUIP</span>' 
                : '<span style="background:#f44336; color:#fff; padding:2px 8px; border-radius:3px; font-size:0.8em; font-weight:bold;">SALVAGE</span>';

            let affixRows = '';
            if (Array.isArray(item?.affixes)) {
                affixRows = item.affixes.map(a => {
                    const icon = a.quality === 'GOOD' ? '✅' : a.quality === 'BAD' ? '❌' : '➖';
                    const color = a.quality === 'GOOD' ? '#4caf50' : a.quality === 'BAD' ? '#f44336' : '#ff9800';
                    return `
                        <div style="padding:4px 0; border-bottom:1px solid #2a2a2a; font-size:0.9em;">
                            <span>${icon}</span>
                            <span style="color:${color}; font-weight:bold;">${a.name || ''}</span>
                            <span style="color:#888;">${a.value || ''}</span>
                            <div style="color:#999; font-size:0.8em;">${a.reason || ''}</div>
                        </div>`;
                }).join('');
            }

            return `
                <div style="flex:1; min-width:250px; border-left:3px solid ${borderColor}; padding:12px; background:#1a1a1a; border-radius:0 4px 4px 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="color:#888; font-size:0.85em; text-transform:uppercase;">${label}</span>
                        ${badge}
                    </div>
                    <h3 style="color:#d4af37; margin:0 0 6px 0; font-size:1.05em;">${item?.title || 'Unknown'}</h3>
                    <div style="color:#aaa; font-size:0.85em; margin-bottom:4px;">
                        ${item?.type || ''} · ${item?.rarity || ''}
                        ${item?.item_power ? ` · ⚡ ${item.item_power}` : ''}
                    </div>
                    ${affixRows}
                </div>`;
        };

        this.el.resultArea.innerHTML = `
            <div style="margin-top:10px;">
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    ${renderItemColumn(result.item_1, 'Item 1', result.winner === '1')}
                    ${renderItemColumn(result.item_2, 'Item 2', result.winner === '2')}
                </div>
                <div style="background:#1a1a1a; border-left:4px solid #d4af37; padding:15px; margin-top:12px; border-radius:0 4px 4px 0;">
                    <div style="font-weight:bold; color:#d4af37; font-size:1.1em; margin-bottom:8px;">
                        🏆 ${result.verdict || `Equip ${winner}`}
                    </div>
                    <div style="color:#ccc; line-height:1.5;">${result.insight || ''}</div>
                </div>
            </div>
        `;
        this.el.resultArea.style.display = 'block';
    },

    // ====================================
    // RENDER: Errors & Rejections
    // ====================================
    renderRejection(title, reason) {
        if (!this.el.resultArea) return alert(`${title}: ${reason}`);
        this.el.resultArea.innerHTML = `
            <div style="background:#330000; color:#ff9999; padding:15px; border:1px solid red; border-radius:5px; margin-top:10px;">
                <h3>🚫 ${title}</h3>
                <p>${reason}</p>
            </div>
        `;
        this.el.resultArea.style.display = 'block';
    },

    renderError(message) {
        console.error(message);
        if (this.el.imageError) {
            this.el.imageError.textContent = `Error: ${message}`;
            this.el.imageError.style.display = 'block';
        } else {
            alert(`Error: ${message}`);
        }
    },

    // ====================================
    // DEMO MODE
    // ====================================
    runDemo() {
        const isCompare = this.state.mode === 'compare';
        this.showLoading(true, isCompare ? 'Running Comparison Demo...' : 'Running Analysis Demo...');
        this.clearResults();
        
        setTimeout(() => {
            if (isCompare) {
                const demoResult = {
                    item_1: {
                        title: 'Harlequin Crest (Shako)',
                        type: 'Helm',
                        rarity: 'Mythic Unique',
                        item_power: '925',
                        affixes: [
                            { name: '+4 Ranks to All Skills', value: 'Max Roll', quality: 'GOOD', reason: 'Best-in-slot universal damage boost.' },
                            { name: 'Damage Reduction', value: '20%', quality: 'GOOD', reason: 'Massive survivability across all builds.' },
                            { name: 'Cooldown Reduction', value: '12%', quality: 'GOOD', reason: 'High roll, enables faster rotations.' },
                            { name: 'Maximum Life', value: '+980', quality: 'GOOD', reason: 'Large flat HP for survivability.' }
                        ]
                    },
                    item_2: {
                        title: 'Deathless Visage',
                        type: 'Helm',
                        rarity: 'Ancestral Legendary',
                        item_power: '890',
                        affixes: [
                            { name: 'Critical Strike Chance', value: '4.5%', quality: 'OK', reason: 'Decent but below max roll of 6%.' },
                            { name: 'Cooldown Reduction', value: '7%', quality: 'BAD', reason: 'Low roll compared to Shako.' },
                            { name: 'Intelligence', value: '+84', quality: 'OK', reason: 'Only useful for Sorcerer/Necromancer.' },
                            { name: 'Thorns', value: '+450', quality: 'BAD', reason: 'Dead stat for most builds.' }
                        ]
                    },
                    winner: '1',
                    verdict: 'EQUIP ITEM 1',
                    insight: 'Harlequin Crest is a clear winner. +4 to All Skills and 20% Damage Reduction make it best-in-slot for virtually every build. The Deathless Visage has a wasted Thorns roll and lower item power.',
                    trade_query: 'Deathless Visage'
                };
                this.renderCompareResult(demoResult);
            } else {
                const demoResult = {
                    title: 'Harlequin Crest (Shako)',
                    type: 'Helm',
                    rarity: 'Mythic Unique',
                    item_power: '925',
                    verdict: 'KEEP (GOD ROLL)',
                    score: 'S Tier',
                    insight: 'This is a best-in-slot item for almost every build in the game. +4 Ranks to All Skills provides an unmatched damage boost, while 20% Damage Reduction and Maximum Life make it incredibly tanky.',
                    affixes: [
                        { name: '+4 Ranks to All Skills', value: 'Max Roll', quality: 'GOOD', reason: 'Essential for boosting all skill damage.' },
                        { name: 'Damage Reduction', value: '20%', quality: 'GOOD', reason: 'Massive survivability layer.' },
                        { name: 'Cooldown Reduction', value: '12%', quality: 'GOOD', reason: 'High roll, perfect for resource management.' },
                        { name: 'Maximum Life', value: '+980', quality: 'GOOD', reason: 'Adds significant survivability.' }
                    ],
                    trade_query: 'Harlequin Crest'
                };
                this.renderAnalyzeResult(demoResult);
            }

            this.showLoading(false);
            
            if (this.el.imagePreview) {
                this.el.imagePreview.src = 'https://danielromeyn.com/Horadric%20AI/harlequin%20crest.jpg';
                this.el.imagePreview.style.display = 'block';
            }
        }, 1500);
    },

    // ====================================
    // HELP MODAL
    // ====================================
    populateHelpContent() {
        if (!this.el.modalContent) return;
        this.el.modalContent.innerHTML = `
            <h3>How to get an API Key</h3>
            <ol>
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#d32f2f">Google AI Studio</a>.</li>
                <li>Click <strong>"Create API Key"</strong>.</li>
                <li>Copy the key starting with <code>AIza...</code></li>
                <li>Paste it into the box on the main screen.</li>
            </ol>
            <p><strong>Is it free?</strong> Yes, Google provides a generous free tier for Gemini Flash.</p>
            <p><strong>Privacy:</strong> Your key is stored locally in your browser and never sent to our servers.</p>
            <hr style="border-color:#444; margin:15px 0;">
            <h3>Analyze vs Compare</h3>
            <p><strong>Analyze</strong> evaluates a single item. Select your class and build for tailored advice, or leave them blank for a general stat breakdown.</p>
            <p><strong>Compare</strong> puts two items head-to-head. Upload both screenshots and the AI will tell you which to equip and which to salvage.</p>
        `;
    },

    // ====================================
    // UI UTILITIES
    // ====================================
    clearResults() {
        if (this.el.resultArea) {
            this.el.resultArea.innerHTML = '';
            this.el.resultArea.style.display = 'none';
        }
    },

    showLoading(show, text) {
        if (this.el.loading) {
            this.el.loading.style.display = show ? 'block' : 'none';
            if (text) {
                const txt = this.el.loading.querySelector('.loading-text');
                if (txt) txt.textContent = text;
            }
        }
        // Disable both action buttons while loading
        if (this.el.analyzeBtn) this.el.analyzeBtn.disabled = show;
        if (this.el.compareBtn) this.el.compareBtn.disabled = show;
    },

    loadState() {
        const k = localStorage.getItem('gemini_api_key');
        if (k && this.el.apiKey) {
            const decoded = atob(k);
            this.el.apiKey.value = decoded;
            this.state.apiKey = decoded;
        }
    },

    saveApiKey() {
        if (!this.el.apiKey) return;
        const k = this.el.apiKey.value.trim();
        if (!k) return;
        this.state.apiKey = k;
        localStorage.setItem('gemini_api_key', btoa(k));
    },
    
    toggleAdvanced() {
        if (this.el.advancedPanel) this.el.advancedPanel.classList.toggle('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => HoradricApp.init());