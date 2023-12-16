const fs = require('fs')

class GUI {
    constructor(path) {
        this.path = path + '/lan_config.json'

        if(!fs.existsSync(this.path)) {
            require('fs').writeFileSync(this.path, JSON.stringify({
                language: '',
                supported_languages: ["en", "ru", "fr", "de"]
            }))
        }

        const { language, supported_languages } = require(this.path)
        this.language = language
        this.supported_languages = supported_languages
    }

    setLanguage(lan) {
        if(this.supported_languages.includes(lan)) {
            this.language = lan
            fs.writeFileSync(this.path, JSON.stringify({
                language: this.language,
                supported_languages: this.supported_languages
            }))
            return {ok: true}
        }

        return {ok: false}
    }

    getLanguage() {
        return {
            isDefined: this.language !== '',
            language: this.language,
        }
    }
}

module.exports = {
    GUI: GUI,
}