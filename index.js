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
    // console.log(getsDummyUser[0].liked);
    const babyDisLiked = getsDummyUser[0].disliked;
    // finds all the babies excluding the dummyUser
    const allBabies = await usersList.find({
      $and: [{
          name: {
            $ne: getsDummyUser[0].name
          },
        }, {
          id: {
            $nin: Object.values(babyLiked)
          },
        },
        {
          id: {
            $nin: Object.values(babyDisLiked)
          }
        },
      ]
    }).toArray();
    // renders the function to the index
    res.render('index', {
      title: 'home',
      users: allBabies
    });
  } catch (error) {
    next(error);
  }
});


// sents the id from the liked user to the match route 
app.post('/match', async (req, res, next) => {
  try {
    // finds the all the users items through the array from the database
    const fromDatabase = await usersList.find().toArray();
    // gets rid of all the users only containing the dummyUser in the array
    const getsDummyUser = fromDatabase.filter(dummyUser);
    // defines the dummyUser object giving the index 0
    const signedUser = getsDummyUser[0];
    // sents the id value from the client side to the server
    const likedId = req.body.like;
    // turning the string value into a integer, considering it as an id
    const turnId = parseInt(likedId, 10);

    const updateUsers = (name) => {
      if (name.like) {
        usersList.updateOne({
          id: signedUser.id
        }, {
          $push: {
            liked: turnId
          }
        });
        return true;
      } else if (name.dislike) {
        usersList.updateOne({
          id: signedUser.id
        }, {
          $push: {
            disliked: turnId
          }
        });
        return false;
      }
    };


    // converts liked ID's into array
    const match = await usersList.find({
        id: turnId,
      })
      .toArray();
    const matchedValue = updateUsers(req.body, signedUser);

    if (matchedValue === true) {
      console.log(`you have a match with ${turnId.id}`);
      res.render('match', {
        users: match
      });
    } else if (matchedValue === false) {
      console.log(`no match with  ${turnId.id}`);
      res.redirect('/');
    }
    console.log(matchedValue);
  } catch (error) {
    next(error);
  }
});

// based on the matched baby picture should reveal the real identity of the match
// van diezelfde id uit de match moet hij renderen naar de profielpagina
app.post('/profile', async (req, res, ) => {
  try {
    // finds the all the users items through the array from the database
    const fromDatabase = await usersList.find().toArray();
    // filters the dummyUser object from the database, but still in the array
    const exclDummyUser = fromDatabase.filter(dummyUser);
    // defines all the liked users of the dummyUser in an array
    const allLikedBabies = exclDummyUser[0].liked;
    // defines the baby that is liked at the moment
    const likedBaby = allLikedBabies.length - 1;
    const likedUser = allLikedBabies[likedBaby];

    // defines the dummyUser object giving the index 0
    const thisUser = exclDummyUser[0];
    console.log(thisUser);

    const showMatch = await usersList.find({
      id: likedUser
    }).toArray();
    console.log(likedUser);
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