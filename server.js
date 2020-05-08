const express = require('express') //inladen van express package
const app = express() //opstarten van express applicatie
const port = 3000 //adres van je webserver


//hier bepaal je welke files express moet gebruiken in mijn applicatie. 
app.use(express.static('public'))

app.get('/', function (req, res) {
  return res.send("Hello World")
})

app.listen(port, function () {
  return console.log('app draait!!')
})