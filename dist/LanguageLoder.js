const fs = require('fs');
const path = require('path');

class LanguageLoader {
    constructor(defaultLang = 'en') {
        this.language = defaultLang;
        this.translations = {};
        this.languagesDir = path.join(process.cwd(), 'locales');
    }

    loadLanguage(lang) {
        const filePath = path.join(this.languagesDir, `${lang}.json`);
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            this.translations[lang] = JSON.parse(data);
        } catch (error) {
            this.translations[lang] = {};
            console.error(`Could not load language file for ${lang}:`, error);
        }
    }

    getTranslation(key, lang = this.language) {
        if(!this.translations[lang]) {
            this.loadLanguage(lang);
        }
        return this.translations[lang][key] || `No translation found for ${key}`;
    }
}

module.exports = new LanguageLoader();
