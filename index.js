// variables
const hbs = require('hbs')
const express = require('express') //inladen van express package
const app = express() //opstarten van express applicatie
const port = 3000 //adres van je webserver
const yoMomma = require('yo-mamma').default //extern package
const fatoe = yoMomma()
const path = require('path')

app.set('view engine', 'hbs')
app.set('views', 'views') //checkt door de views map

// gebruikt deze map (public) om html bestanden te serveren
app.use(express.static('public'));
hbs.registerPartials(path.join(__dirname, '/views/partials'))

// different routes of static pages
// Hbs tranformeert hbs files naar .html en vertsuurd deze naar public folder
app.get('/', (req, res) => {
  res.render('index', {
    title: 'home',
    fatoe
  });
});

app.get('/match', (req, res) => {
  res.render('match', {
    title: 'match',
    name: 'Zuko',
    age: 20,
    isName: true,
    isAgeValid: false
  });
});


//renders couple objects containing arrays to the profile.hbs
app.get('/profile', (req, res) => {
  res.render('profile', {
    title: 'profile',
    people: [
      "Katara",
      "Aang",
      "Sokka",
      "Zuko",
      "Toph",
    ],
    interests: [{
        skills: ['firebending', 'earthbending', 'airbending']
      },
      {
        hobbies: ['violin', 'reading']
      }
    ]
  });
});


// Application running on port...
app.listen(port, function () {
  return console.log(`app draait op port ${port}!!`)
});