const fs = require('fs')

class Train {
    constructor(path, packs) {
        this.path = path
        this.packs = packs

        if(!fs.existsSync(this.path + '/progress.json')) {
            var data = {
                packs: {

                }
            }

            for(let i in packs) {
                data.packs[i] = {}

                for(let word of packs[i].words)  {
                    data.packs[i][word.word] = {
                        packId: packs[i].id,
                        word: word,
                        correct: 0,
                        wrong: 0,
                        progress: 0
                    }
                }
            }

            this.data = data

            this.saveData()
        }

        this.data = require(this.path + '/progress.json')
    }

    saveData() {
        fs.writeFileSync(this.path + '/progress.json', JSON.stringify(this.data))
    }

    getRandomWord(pack) {
        var wordsList = {}

        if(pack) {
            if(!this.data.packs[pack]) return {error: 'Pack not found'}
            wordsList = this.data.packs[pack]
        } else {
            for(let i in this.data.packs) {
                wordsList = {
                    ...wordsList,
                    ...this.data.packs[i],
                }
            }
        }

        const keys = Object.keys(wordsList)
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        const randomWordData = wordsList[randomKey]

        return randomWordData
    }

    applyResult(data) {
        const { pack, word, result } = data
        
        if(result) {
            this.data.packs[pack][word].correct += 1
        } else {
            this.data.packs[pack][word].wrong += 1
        }

        this.data.packs[pack][word].progress = this.data.packs[pack][word].correct / (this.data.packs[pack][word].correct + this.data.packs[pack][word].wrong)
    
        this.saveData()
    }

    getLeastKnown(pack) {
        var wordsList = {}

        if(pack) {
            if(!this.data.packs[pack]) return {error: 'Pack not found'}
            wordsList = this.data.packs[pack]
        } else {
            for(let i in this.data.packs) {
                wordsList = {
                    ...wordsList,
                    ...this.data.packs[i],
                }
            }
        }

        let leastKnownWordKey = Object.keys(wordsList).reduce((a, b) => wordsList[a].progress < wordsList[b].progress ? a : b)
        return wordsList[leastKnownWordKey]
    }
}

module.exports = {
    Train: Train,
}