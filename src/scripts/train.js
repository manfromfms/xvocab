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
}

module.exports = {
    Train: Train,
}