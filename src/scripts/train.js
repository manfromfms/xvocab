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

        const pairs = Object.entries(wordsList).map(([key, val]) => [key, Math.pow(1.1 - val.progress, 4)])
        const sum = pairs.reduce((acc, val) => acc + val[1], 0)
        const chances = pairs.map(([key, val]) => [key, val / sum])

        var rand = Math.random()
        var cumulative = 0.0
        for (let i = 0; i < chances.length; i++) {
            cumulative += chances[i][1]
            if (rand < cumulative) {
                return wordsList[chances[i][0]]
            }
        }
    }
}

module.exports = {
    Train: Train,
}