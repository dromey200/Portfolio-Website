# Multi-Language Support Implementation Guide

## ✅ What's Been Set Up

Your Horadric AI application now has a complete internationalization (i18n) system with support for 8 languages:

- **English** (en)
- **Spanish** (es) 
- **French** (fr)
- **German** (de)
- **Portuguese** (pt)
- **Russian** (ru)
- **Chinese Simplified** (zh)
- **Japanese** (ja)

## 📁 New Files Created

### 1. **translations.js** 
   - Core i18n module with all translation data
   - Handles language detection and switching
   - Stores language preference in localStorage
   - Auto-detects user's browser language on first visit

### 2. **i18n-ui.js**
   - Updates the UI when language changes
   - Handles dynamic element translation
   - Updates page title and meta descriptions
   - Manages language switcher dropdown

## 🎯 How It Works

### User Flow:
1. User visits the site
2. Browser language is auto-detected
3. If supported, page loads in their language
4. User can manually switch via dropdown in header
5. Choice is saved to localStorage

### Technical Flow:
```
HTML (data-i18n attributes)
    ↓
JavaScript calls i18n.get('key')
    ↓
Looks up translation in translations.js
    ↓
Returns translated text
```

## 🔧 How to Add/Update Translations

### Adding a New Translation Key:

1. **Add to translations.js** in each language:
```javascript
translations: {
    en: {
        'new_key': 'English text here',
        ...
    },
    es: {
        'new_key': 'Texto en español aquí',
        ...
    },
    // ... add to all 8 languages
}
```

2. **Use in HTML:**
```html
<button data-i18n="new_key">English text here</button>
<label data-i18n="new_key">English text here</label>
<p data-i18n="new_key">English text here</p>
```

3. **Use in JavaScript:**
```javascript
const text = i18n.get('new_key');
element.textContent = text;
```

### Updating Existing Translations:

Simply find the key in `translations.js` and update the text in each language section.

## 📝 Common Usage Patterns

### In HTML (Static Elements):
```html
<h2 data-i18n="analyze_item">Analyze Item</h2>
<button data-i18n="close">Close</button>
<span data-i18n="loading">Loading...</span>
```

### In JavaScript (Dynamic Content):
```javascript
// Simple text replacement
element.textContent = i18n.get('error_analyzing');

// With fallback
const message = i18n.get('custom_key', 'Default text');

// Multiple translations
const title = i18n.get('app_title');
const subtitle = i18n.get('app_subtitle');
```

### Adding Translations to Dynamic Content:
```javascript
// Create translated element
const button = document.createElement('button');
button.textContent = i18n.get('submit');

// Or use data attribute and let i18nUI handle it
const label = document.createElement('label');
label.setAttribute('data-i18n', 'submit');
label.textContent = i18n.get('submit');

// After adding to DOM, call translation
i18nUI.translatePage();
```

## 🚀 Integration with Existing Code

### For app.js:
Replace hardcoded strings:
```javascript
// Before:
element.textContent = "Analyzing item...";

// After:
element.textContent = i18n.get('analyzing');
```

### For analytics.js:
Add i18n translations to tracking events:
```javascript
// Before:
this.track('event_name', { text: "Some text" });

// After:
this.track('event_name', { text: i18n.get('some_key') });
```

### For Error Messages:
```javascript
// Before:
alert('Error analyzing item. Please try again.');

// After:
alert(i18n.get('error_analyzing'));
```

## 🌐 Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| es | Spanish | Español |
| fr | French | Français |
| de | German | Deutsch |
| pt | Portuguese | Português |
| ru | Russian | Русский |
| zh | Chinese (Simplified) | 中文 |
| ja | Japanese | 日本語 |

## 💾 Language Preference Storage

- Language preference is saved to `localStorage` as `horadric_language`
- Auto-detects browser language on first visit (falls back to English if not supported)
- User can change language anytime using the dropdown

## 🔄 Language Change Event

Listen for language changes in your code:
```javascript
window.addEventListener('languageChanged', (event) => {
    const newLanguage = event.detail.language;
    console.log('Language changed to:', newLanguage);
    // Update any custom content
});
```

## ✨ Features

✅ **8 languages** with full translations  
✅ **Auto language detection** based on browser settings  
✅ **Language preference persistence** via localStorage  
✅ **Dynamic page updates** when language changes  
✅ **Easy extensibility** - add new languages in minutes  
✅ **SEO-friendly** - proper lang attributes for search engines  
✅ **Accessibility** - proper semantic HTML with i18n support  

## 🛠️ Adding a New Language

To add a new language (e.g., Italian - it):

1. Add language to `supportedLanguages` in translations.js:
```javascript
supportedLanguages: {
    'it': 'Italiano',
    // ... existing languages
}
```

2. Add language object with all keys:
```javascript
translations: {
    // ... existing languages
    it: {
        'app_title': 'Horadric AI',
        'app_subtitle': 'Analizzatore di Bottino Diablo 4',
        // ... copy all keys from 'en' and translate
    }
}
```

3. Add option to language selector in HTML:
```html
<option value="it">Italiano</option>
```

## 📊 Current Translation Coverage

Currently **78 translation keys** are available covering:
- App title & description
- UI buttons & controls
- Error messages
- Loading states
- Analytics labels
- Feature names
- Common actions

## 🎓 Next Steps

1. **Add more translations** to app.js, pricing.js, and other JS files
2. **Test in different languages** to ensure formatting works
3. **Consider RTL languages** (Arabic, Hebrew) in future updates
4. **Add language toggle buttons** in modals/settings if needed
5. **Update documentation** with language information

## 📞 Support

If you need to:
- **Add more translation keys** - Add them to translations.js in all languages
- **Change translations** - Update the text in translations.js
- **Add new languages** - Follow the "Adding a New Language" section above
- **Debug language issues** - Check browser console and localStorage

---

**Current Implementation Status:** ✅ Complete and Ready to Use

The i18n system is fully functional. Simply add `data-i18n="key"` attributes to HTML elements or use `i18n.get('key')` in JavaScript to use translations!
