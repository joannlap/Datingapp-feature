// variables
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // opstarten van express applicatie
const port = 4000;
const path = require('path');
require('dotenv').config();
const {
  MongoClient
} = require('mongodb');

let db = null;
let usersList = null;
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;

// middleware
app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
app.use(bodyParser.urlencoded({
  extended: true
}));
hbs.registerPartials(path.join(__dirname, '/views/partials'));


// DATABASE CONNECTION
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.log('Unable to connect to database');
  }
  db = client.db(process.env.DB_NAME);
  usersList = db.collection('users');
});

// renders the home page of all the boys except for the registered user
const test = 'joann';
const dummyUser = (user) => user.name === test;

app.get('/', async (req, res, next) => {
  try {
    // finds the all the users items through the array from the database
    const fromDatabase = await usersList.find().toArray();
    // filters the dummyUser out of the database
    const getsDummyUser = fromDatabase.filter(dummyUser);
    // defines the liked users of the dummyUser
    const babyLiked = getsDummyUser[0].liked;
    console.log(getsDummyUser[0].liked);
    // finds all the boys excluding the dummyUser

    // function that displays all the babies profilecards without
    // showing the dummyUser
    const allBabies = await usersList.find({
      $and: [{
        name: {
          $ne: getsDummyUser[0].name
        },
      }, {
        id: {
          $nin: Object.values(babyLiked)
        },
      }]
    }).toArray();
    res.render('index', {
      title: 'home',
      users: allBabies
    });
  } catch (err) {
    next(err);
  }
});



// redirects to homepage when clicking on keepswiping button
app.post('/', async (req, res, next) => {
  try {
    const allBabies = await usersList.find({}).toArray();
    res.render('index', {
      title: 'home',
      users: allBabies
    });
  } catch (err) {
    next(err);
  }
});

// match route should update te person who is liked
// hier moet de id meegegeven worden en geupdatet vanuit de gelikete button uit de index
app.post('/match', async (req, res, next) => {
  try {
    // finds the all the users items through the array from the database
    const fromDatabase = await usersList.find().toArray();
    // filters the dummyUser object from the database, but still in the array
    const getsDummyUser = fromDatabase.filter(dummyUser);
    // defines the dummyUser object giving the index 0
    const thisUser = getsDummyUser[0];
    // defines the liked users of the dummyUser
    const babyLiked = getsDummyUser[0].liked;
    // sents the id value from the client side to the server
    const likedId = req.body.id;
    // turning the string value into a integer, considering it as an id
    const id = parseInt(likedId, 10);

    // function that updates the liked baby and pushes the id to the liked array
    await usersList.updateOne({
      id: thisUser.id
    }, {
      $push: {
        liked: id
      }
    });
    // function that displays all the babies profilecards without
    // showing the dummyUser
    const allBabies = await usersList.find({
      $and: [{
        name: {
          $ne: getsDummyUser[0].name,
        },
      }, {
        id: {
          $nin: Object.values(babyLiked)
        },
      }]
    }).toArray();

    // console.log(getsDummyUser[0]);
    console.log(likedId);

    res.render('match', {
      users: allBabies
    });
  } catch (err) {
    next(err);
  }
});

// based on the matched baby picture should reveal the real identity of the match
// van diezelfde id uit de match moet hij renderen naar de profielpagina
app.post('/profile', async (req, res, ) => {
  try {
    const fromDatabase = await usersList.find().toArray();
    const exclDummyUser = fromDatabase.filter(dummyUser);
    const boyLiked = exclDummyUser[0].liked;
    const recentBoyLiked = boyLiked.length - 1;
    const thisUser = exclDummyUser[0];
    console.log(thisUser);

    const showMatch = await usersList.find({
      id: recentBoyLiked
    }).toArray();
    console.log(recentBoyLiked);
    res.render('profile', {
      users: showMatch
    });
  } catch (err) {
    res.status(404).send(err);
  }
});


app.get('/*', (req, res) => {
  res.status(404).render('error');
});

// Application running on port...
app.listen(port, () => console.log(`app draait op port ${port}!!`));