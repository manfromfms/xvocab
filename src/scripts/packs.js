const fs = require('fs')

class Pack {
    constructor() {

    }
}

var importPacks = (dir) => {
    var folders = fs.readdirSync(dir)

    var result = {}

    for(let f of folders) {
        if(fs.existsSync(`${dir}/${f}/config.json`)) {
            try {
                var config = require(`${dir}/${f}/config.json`)

                const { name, description, files, packId } = config

                const pack = new Pack()
                pack.name = name || ''
                pack.description = description || ''
                pack.words = []
                pack.id = packId
                
                for(let i in files) {
                    pack.words.push(...require(`${dir}/${f}/${files[i]}`))
                }

                result[packId] = pack

            } catch(err) {
                console.log(`Unable to load ${f}`)
            }
        } else {
            console.log(`Unable to load ${f}`)
        }
    }

    return result
}

var packsList = (arr) => {
    var result = []

    for(let i in arr) {
        result.push({
            name: arr[i].name,
            id: arr[i].id,
            description: arr[i].description,
            words: {
                amount: arr[i].words.length
            }
        })
    }

    return result
}

module.exports = {
    importPacks: importPacks,
    packsList: packsList,
    Pack: Pack,
}