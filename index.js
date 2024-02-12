// Load packs
const { importPacks, packsList } = require('./src/scripts/packs')
var packs = importPacks(__dirname + '/data/packs')

console.log(`Successfuly loaded ${Object.keys(packs).length} packs`)

// Boot up training
const { Train } = require('./src/scripts/train')
const train = new Train(__dirname + '/data/user', packs)

// Load GUI params
const { GUI } = require('./src/scripts/gui')
const gui = new GUI(__dirname + '/data/user/')

// Config express
const express = require('express')
const app = express()
const port = 4100




// ----- GUI ------
// Language selection page + redirect + global files
app.get('/', (req, res) => {
    if(gui.getLanguage().isDefined) {
        res.redirect(`/${gui.getLanguage().language}/`)
    } else {
        res.sendFile(__dirname + '/src/gui/main/index.html')
    }
}).get('/global/get-language-gui.js', (req, res) => {
    res.sendFile(__dirname + '/src/gui/global/get-language-gui.js')
}).get('/global/style.css', (req, res) => {
    res.sendFile(__dirname + '/src/gui/global/style.css')
}).get('/global/script.js', (req, res) => {
    res.sendFile(__dirname + '/src/gui/global/script.js')
})


// Media
app.get('/media/:name', (req, res) => {
    res.sendFile(__dirname + '/src/gui/media/' + req.params.name)
})


// Home page
app.get('/:language/', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/index.html`)
}).get('/:language/style.css', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/style.css`)
})

// Pack info page
app.get('/:language/pack', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/pack/index.html`)
})

// Train pages
app.get('/:language/train', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/train/index.html`)
})

// Cards pages
app.get('/:language/cards', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/cards/index.html`)
})


// ----- API ------
app.get('/api/v1/get-packs-list', (req, res) => {
    res.json(packsList(packs))
}).get('/api/v1/get-random-word', (req, res) => {
    res.json(train.getRandomWord(req.query.pack))
}).get('/api/v1/post-result', (req, res) => {
    train.applyResult({pack: req.query.pack, word: req.query.word, result: req.query.result === 'true'})
    res.send(true)
}).get('/api/v1/get-pack-data', (req, res) => {
    res.json(packs[req.query.id])
}).get('/api/v1/get-word', (req, res) => {
    if(req.query.type === '1') {
        res.json(train.getLeastKnown(req.query.pack))
    }
})

app.get('/api/v1/set-language', (req, res) => {
    res.json(gui.setLanguage(req.query.language))
})

// Start the server
app.listen(port, () => {
    console.log(`Listening :${port}`)
})