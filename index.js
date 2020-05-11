// packages
const express = require('express') //inladen van express package
const app = express() //opstarten van express applicatie
const port = 3000 //adres van je webserver
const yoMomma = require('yo-mamma').default
let insult

// middleware
app.use(express.static('public'))


// routing of static pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html')
  insult = yoMomma()
  console.log(insult)
})

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html')
})

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html')
})

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/error.html')
})

// Application running on port...
app.listen(port, function () {
  return console.log(`app draait op port ${port}!!`)
})