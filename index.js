// variables
const hbs = require('hbs')
const express = require('express') //inladen van express package
const app = express() //opstarten van express applicatie
const port = 3000 //adres van je webserver
const yoMomma = require('yo-mamma').default //extern package


app.set('view engine', 'hbs')
app.set('views', 'hbs')
// gebruikt deze map om html bestanden te serveren (rootfolder)
app.use(express.static('public'))
const fatoe = yoMomma()
const tweedeFatoe = yoMomma()

// routing of static pages
// generates hbs file with sent data
// Hbs tranformeert hbs files naar .html en
// vertsuurd deze naar public folder
app.get('/', (req, res) => {
  res.render('index', {
    fatoe
  })
})

app.get('/match', (req, res) => {
  res.render('match', {
    tweedeFatoe
  })
})


// Application running on port...
app.listen(port, function () {
  return console.log(`app draait op port ${port}!!`)
  //  insult = yoMomma()
  //  return console.log(insult)
})