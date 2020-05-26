// variables
const hbs = require('hbs');
const express = require('express'); // inladen van express package

const app = express(); // opstarten van express applicatie
const port = 4000; // adres van je webserver
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongo = require('mongodb');

app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
  .use(bodyParser.urlencoded({
    extended: true
  }));

hbs.registerPartials(path.join(__dirname, '/views/partials'));

// different routes of static pages
// Hbs tranformeert hbs files naar .html en vertsuurd deze naar public folder


// CONNECT TO DATABASE
let db = null;
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;
let usersCollection = null;

mongo.MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.log('Unable to connect to database');
  } else if (client) {
    console.log('database is connected');
  }

  db = client.db(process.env.DB_NAME);
  usersCollection = db.collection('users');
});

// laadt de indexpagina
// functie die mij (de gebruiker) wegfiltert, om alle gebruikers te tonen op de homepagina
app.get('/', async (req, res, next) => {
  try {
    // let gebruikers = await usersCollection.find().toArray();
    const notMe = await usersCollection.find({
      id: {
        $ne: 9
      }
    }).toArray();

    console.log(notMe);
    res.render('index', {
      title: 'home',
      users: notMe
    });
  } catch (err) {
    next(err);
  }
});

// res.render => naar pagina
// res.redirect => naar route

// Als je liked wordt je doorgestuurd naar de match pagina,
// zodra je disliked blijf je op de index
app.post('/match', (req, res) => {
  if (req.body.like) {
    res.render('match', {
      title: 'match',
      // users: userData[0]
    });
    console.log(req.body.like);
  } else if (req.body.dislike) {
    res.redirect('/');
    console.log(req.body.dislike);
  }
});

app.get('/match-list', (req, res) => {
  res.render('match-list', {
    title: ' match-list',
    // users: userData
  });
  // liked people inladen
});


// renders couple objects containing arrays to the profile.hbs
app.get('/profile', (req, res) => {
  res.render('profile', {
    title: 'profile',
    interests: [{
        skills: ['firebending', 'earthbending', 'airbending', 'waterbending']
      },
      {
        hobbies: ['violin', 'reading']
      }
    ]
  });
});

// app.get('/*')


// Application running on port...
app.listen(port, function () {
  return console.log(`app draait op port ${port}!!`);
});