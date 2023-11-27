const { importPacks, packsList } = require('./src/scripts/packs')
var packs = importPacks(__dirname + '/data/packs')
console.log(`Successfuly loaded ${packs.length} packs`)


const { GUI } = require('./src/scripts/gui')
const gui = new GUI(__dirname + '/data/user/')


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
}).get('/:language/pack', (req, res) => {
    res.sendFile(__dirname + `/src/gui/${req.params.language}/pack/index.html`)
})


// ----- API ------
app.get('/api/v1/get-packs-list', (req, res) => {
    res.json(packsList(packs))
}).get('/api/v1/set-language', (req, res) => {
    res.json(gui.setLanguage(req.query.language))
}).get('/api/v1/get-pack-data', (req, res) => {
    res.json(packs[req.query.id])
})


app.listen(port, () => {
    console.log(`Listening :${port}`)
})