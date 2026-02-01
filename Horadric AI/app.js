// ====================================
// HORADRIC AI - APP ENGINE
// Version: 1.6.1 (Fixed Buttons & Demo Mode)
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null,
        mode: 'identify'
    },
    
    el: {}, 
    
    init() {
        this.cacheElements();
        this.loadState();
        this.attachEventListeners();
        this.updateClassOptions(); 
        console.log('👁️ Horadric Eye Opened (Gemini 2.5 Flash Active)');
    },
    
    cacheElements() {
        // Core Inputs
        this.el.playerClass = document.getElementById('player-class');
        this.el.buildStyle = document.getElementById('build-style');
        this.el.imageUpload = document.getElementById('image-upload');
        this.el.imagePreview = document.getElementById('image-preview');
        // FIX: HTML id is 'upload-group', not 'upload-zone'
        this.el.uploadZone = document.getElementById('upload-group'); 
        this.el.apiKey = document.getElementById('api-key');
        
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
        this.el.resultsCard = document.getElementById('results-card');
        this.el.loading = document.getElementById('loading');
        this.el.imageError = document.getElementById('image-error');
        
        // Buttons
        this.el.analyzeBtn = document.getElementById('analyze-btn');
        this.el.demoBtn = document.getElementById('demo-btn'); // Added
        this.el.helpTrigger = document.getElementById('help-trigger'); // Added
        this.el.modeIdentify = document.getElementById('mode-identify');
        this.el.modeCompare = document.getElementById('mode-compare');

        // Modals
        this.el.helpModal = document.getElementById('help-modal'); // Added
        this.el.modalClose = document.getElementById('modal-close-btn'); // Added
        this.el.modalContent = document.getElementById('modal-content-dynamic'); // Added
    },

    attachEventListeners() {
        if (this.el.playerClass) this.el.playerClass.addEventListener('change', () => this.updateBuildOptions());
        if (this.el.imageUpload) this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        
        if (this.el.modeIdentify) this.el.modeIdentify.addEventListener('click', () => this.setMode('identify'));
        if (this.el.modeCompare) this.el.modeCompare.addEventListener('click', () => this.setMode('compare'));
        if (this.el.toggleAdvanced) this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());

        if (this.el.analyzeBtn) this.el.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        
        // FIX: Add Demo Listener
        if (this.el.demoBtn) this.el.demoBtn.addEventListener('click', () => this.runDemo());

        // FIX: Add Help Modal Listeners
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
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.el.helpModal) {
                this.el.helpModal.style.display = 'none';
            }
        });
        
        if (this.el.uploadZone) this.setupDragDrop();
        
        if (this.el.apiKey) this.el.apiKey.addEventListener('change', () => this.saveApiKey());
    },

    setupDragDrop() {
        const zone = this.el.uploadZone;
        if (!zone) return; // Safety check

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
            zone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
        });
        zone.addEventListener('dragover', () => zone.classList.add('drag-over'));
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            zone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.el.imageUpload.files = e.dataTransfer.files;
                this.handleFileSelect({ target: this.el.imageUpload });
            }
        });
    },

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
        if (!cls || cls === "Any") {
            this.el.buildStyle.innerHTML = '<option value="">Any / General</option>';
            return;
        }

        const classDef = CONFIG.CLASS_DEFINITIONS['d4'][cls] || { builds: [], mechanics: [] };

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

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (this.el.imagePreview) {
                this.el.imagePreview.src = ev.target.result;
                this.el.imagePreview.style.display = 'block';
            }
            // Optional: Hide label if you want to clean up UI after upload
            // if (this.el.uploadZone) {
            //     const label = this.el.uploadZone.querySelector('label');
            //     if (label) label.style.display = 'none';
            // }
        };
        reader.readAsDataURL(file);
        if (this.el.imageError) this.el.imageError.style.display = 'none';
    },
    // ====================================
    // DEMO MODE LOGIC
    // ====================================
    runDemo() {
        this.showLoading(true, "Running Simulation (Demo)...");
        this.clearResults();
        
        // Simulate network delay
        setTimeout(() => {
            const demoResult = {
                title: "Harlequin Crest (Shako)",
                type: "Helm",
                rarity: "Mythic Unique",
                verdict: "KEEP (GOD ROLL)",
                score: "S Tier",
                insight: "This is a best-in-slot item for almost every build in the game due to +4 Ranks and massive Damage Reduction.",
                analysis: "**+4 Ranks to All Skills**: Essential for boosting damage.\n**Cooldown Reduction**: High roll, perfect for resource management.\n**Resource Generation**: Critical for spamming core skills.\n**Maximum Life**: Adds significant survivability."
            };
            
            this.renderSuccess(demoResult);
            this.showLoading(false);
            
            // Auto-populate class for visual effect
            if(this.el.playerClass) this.el.playerClass.value = "Any";
            if(this.el.imagePreview) {
                // UPDATED IMAGE URL HERE
                this.el.imagePreview.src = "https://danielromeyn.com/Horadric%20AI/harlequin%20crest.jpg"; 
                this.el.imagePreview.style.display = 'block';
            }
        }, 1500);
    },

    // ====================================
    // HELP MODAL LOGIC
    // ====================================
    populateHelpContent() {
        if(!this.el.modalContent) return;
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
        `;
    },

    async handleAnalyze() {
        if (!this.state.apiKey) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                this.state.apiKey = atob(savedKey);
                if(this.el.apiKey) this.el.apiKey.value = this.state.apiKey;
            } else {
                return alert('Please enter your Gemini API Key or try Demo Mode.');
            }
        }
        
        if (!this.el.imagePreview || !this.el.imagePreview.src) return alert('Please upload an item image.');

        this.showLoading(true, "Consulting Deckard Cain...");
        this.clearResults();

        try {
            const imageBase64 = this.el.imagePreview.src.split(',')[1];
            const mimeType = this.el.imagePreview.src.split(';')[0].split(':')[1] || 'image/jpeg';
            
            // STAGE 1: Recognition
            const detectPrompt = PROMPT_TEMPLATES.detect();
            const detectResult = await this.callGemini(detectPrompt, imageBase64, mimeType);
            
            if (!detectResult) throw new Error("AI Recognition Failed.");
            const category = (detectResult.category || detectResult.game || 'unknown').toLowerCase();

            if (category === 'not_loot') {
                this.renderRejection("Not a Game Item", "This looks like a real-world photo. Please upload a direct screenshot from Diablo 4.");
                this.showLoading(false);
                return;
            }

            // STAGE 2: Deep Analysis
            this.showLoading(true, "Analyzing Stats...");
            
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
            
            const analyzePrompt = PROMPT_TEMPLATES.analyze(pClass, build, advancedSettings);
            const analysisResult = await this.callGemini(analyzePrompt, imageBase64, mimeType);
            
            if (!analysisResult) throw new Error("Analysis failed. Please try again.");
            
            this.renderSuccess(analysisResult);

        } catch (error) {
            console.error(error);
            if (this.el.imageError) {
                this.el.imageError.textContent = `Error: ${error.message}`;
                this.el.imageError.style.display = 'block';
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            this.showLoading(false);
        }
    },

    async callGemini(prompt, imageBase64, mimeType) {
        // USING GEMINI 2.5 FLASH
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.state.apiKey}`;
        
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
                    response_mime_type: "application/json",
                    temperature: 0.1
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Gemini API Error');
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error("Gemini returned an empty response.");
        }
        
        return this.safeJSONParse(data.candidates[0].content.parts[0].text);
    },

    safeJSONParse(str) {
        try {
            // Remove markdown formatting
            let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Locate the pure JSON object
            const start = clean.indexOf('{');
            const end = clean.lastIndexOf('}');
            
            if (start === -1 || end === -1) return null;
            
            // Extract and parse
            clean = clean.substring(start, end + 1);
            return JSON.parse(clean);
        } catch (e) { 
            console.error("JSON Parse Error:", e);
            return null; 
        }
    },

    renderRejection(title, reason) {
        if (!this.el.resultArea) return alert(`${title}: ${reason}`);
        this.el.resultArea.innerHTML = `
            <div style="background:#330000; color:#ff9999; padding:15px; border:1px solid red; border-radius:5px; margin-top:10px;">
                <h3>🚫 ${title}</h3>
                <p>${reason}</p>
            </div>
        `;
        this.el.resultArea.style.display = 'block';
        if (this.el.resultsCard) this.el.resultsCard.style.display = 'block';
    },

    renderSuccess(result) {
        if (!this.el.resultArea) return;

        const formatMD = (text) => text ? text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') : '';

        this.el.resultArea.innerHTML = `
            <div style="border-left: 4px solid #d4af37; padding: 15px; background: #1a1a1a; margin-top:10px;">
                <h2 style="color:#d4af37; margin-top:0;">${result.title || 'Item'}</h2>
                <div style="font-weight:bold; margin:10px 0;">VERDICT: ${result.verdict}</div>
                <div style="color:#aaa; font-style:italic;">${result.insight}</div>
                <hr style="border-color:#333; margin:15px 0;">
                <div>${formatMD(result.analysis)}</div>
            </div>
        `;
        
        this.el.resultArea.style.display = 'block';
        if (this.el.resultsCard) this.el.resultsCard.style.display = 'block';
    },

    clearResults() {
        if (this.el.resultArea) {
            this.el.resultArea.innerHTML = '';
            this.el.resultArea.style.display = 'none';
        }
        if (this.el.resultsCard) this.el.resultsCard.style.display = 'none';
    },

    showLoading(show, text) {
        if (this.el.loading) {
            this.el.loading.style.display = show ? 'block' : 'none';
            if (text) {
                const txt = this.el.loading.querySelector('.loading-text');
                if (txt) txt.textContent = text;
            }
        }
        if (this.el.analyzeBtn) {
            this.el.analyzeBtn.disabled = show;
            this.el.analyzeBtn.textContent = show ? 'Processing...' : 'Identify Item';
        }
    },

    loadState() {
        const k = localStorage.getItem('gemini_api_key');
        if(k && this.el.apiKey) {
            const decoded = atob(k);
            this.el.apiKey.value = decoded;
            this.state.apiKey = decoded;
        }
    },

    saveApiKey() {
        if (!this.el.apiKey) return;
        const k = this.el.apiKey.value.trim();
        if(!k) return;
        this.state.apiKey = k;
        localStorage.setItem('gemini_api_key', btoa(k));
    },
    
    setMode(mode) { 
        this.state.mode = mode; 
    },
    
    toggleAdvanced() {
        if(this.el.advancedPanel) this.el.advancedPanel.classList.toggle('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => HoradricApp.init());