// variables
const hbs = require('hbs');
const express = require('express'); // inladen van express package

const app = express(); // opstarten van express applicatie
const port = 4000; // adres van je webserver
const path = require('path');
require('dotenv').config();
const mongo = require('mongodb');

const router = new express.Router();
// const multer = require('multer');
// const sharp = require('sharp');
let db = null;
let usersList = null;
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;

app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
  .use(express.json());

hbs.registerPartials(path.join(__dirname, '/views/partials'));


// CONNECT TO DATABASE
mongo.MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.log('Unable to connect to database');
  } else if (client) {
    console.log('database connected');
  }

  db = client.db(process.env.DB_NAME);
  usersList = db.collection('users');
});

// renders home page
app.get('/', async (req, res, next) => {
  try {
    const userOne = await usersList.find({}).toArray();
    res.render('index', {
      title: 'home',
      users: userOne
    });
  } catch (err) {
    next(err);
  }
});

// redirects to home
app.post('/', async (req, res, next) => {
  try {
    const userOne = await usersList.find({}).toArray();
    res.render('index', {
      title: 'home',
      users: userOne
    });
  } catch (err) {
    next(err);
  }
});

// match route
app.post('/match', async (req, res, next) => {
  try {
    const userOne = await usersList.find({
      name: 'Dré'
    }).toArray();
    res.render('match', {
      title: 'match',
      users: userOne
    });
  } catch (err) {
    next(err);
  }
});

app.post('/profile', async (req, res) => {
  try {
    const userOne = await usersList.find({
      name: 'Dré'
    }).toArray();
    res.render('profile', {
      title: 'profile',
      users: userOne
    });
  } catch (err) {
    console.log(err);
  }
});
// fotos ophalen uit de database
// router.get('/users', async (req, res) => {
//   try {
//     const matchedUser = await db.collection('users').findOne({
//       name: 'Collin'
//     });
//     console.log(matchedUser);
//     if (!matchedUser || !matchedUser.img) {
//       throw new Error();
//     }
//     res.set('Content-Type', 'image/png');
//     res.status(200).send(matchedUser.img);
//     // stuurt een 404 error als de foto niet bestaat in de database
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// });


app.get('/*', (req, res) => {
  res.status(404).render('error');
});

// Application running on port...
app.listen(port, () => console.log(`app draait op port ${port}!!`));