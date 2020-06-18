// packages
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // opstarten van express applicatie
// const port = 4000;
const path = require('path');
require('dotenv').config();
const {
  MongoClient
} = require('mongodb');
const session = require('express-session');
const {
  homedir
} = require('os');
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;
let db = null;
let usersList = null;

// middleware
app
  .listen(process.env.PORT || 4000)
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
  .use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    secure: true,
  }))
  .use(bodyParser.urlencoded({
    extended: true
  }));
hbs.registerPartials(path.join(__dirname, '/views/partials'));

app
  .get('/signin', signIn)
  .post('/loading', loading)
  .get('/', home)
  .post('/match', match)
  .post('/profile', profile);

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

// inlogpagina waar alle session gebruikers worden weergeven
async function signIn(req, res, next) {
  try {
    const fromDatabase = await usersList.find().toArray();
    res.render('signin', {
      title: 'signin',
      users: fromDatabase
    });
  } catch (error) {
    next(error);
  }
};

// hier wordt je doorgestuurd naar de indexpagina
async function loading(req, res, next) {
  try {
    req.session.name = req.body.name;
    console.log(req.session.name);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

// indexpagina
async function home(req, res, next) {
  try {
    // elke keer de server opnieuw start
    // redirect je naar inlogpagina
    if (req.session.name === undefined) {
      res.redirect('/signin');
    }
    // haalt session gebruiker uit de database
    let signedUser = await usersList.find({
      name: req.session.name
    }).toArray();
    // alle gebruikers uit de database gehaald zonder signedUser mee te nemen
    const allBabies = await usersList.find({
      $and: [{
        name: {
          $ne: signedUser[0].name
        },
      }, {
        name: {
          // array waar alle gelikete users in worden opgeslagen
          // waardoor hij niet meer zichtbaar is op de index
          $nin: Object.values(signedUser[0].liked)
        },
      }, {
        name: {
          // array waar alle gelikete users in worden opgeslagen
          // waardoor hij niet meer zichtbaar is op de index
          $nin: Object.values(signedUser[0].disliked)
        },
      }]
    }).toArray();
    // allBabies wordt gerendert naar de index
    res.render('index', {
      title: 'home',
      users: allBabies
    });
  } catch (error) {
    next(error);
  }
};

async function updateLikedUsers(isLike, signedUser) {
  console.log('uitgevoerd');
  console.log(isLike);
  try {
    await usersList.updateOne({
      name: signedUser[0].name,
    }, {
      $push: {
        liked: isLike,
      },
    });
    return true;
  } catch (kuuuuttt) {
    console.log(kuuuuttt);
  }
};


async function updateDislikedUsers(dislike, signedUser) {
  console.log('uitgevoerd');

  try {
    await usersList.updateOne({
      name: signedUser[0].name,
    }, {
      $push: {
        liked: dislike,
      },
    });
    return false;
  } catch (kuuuuttt) {
    console.log(kuuuuttt);
  }
};
// gelikete user wordt doorgestuurd naar match pagina
async function match(req, res, next) {
  const like = req.body.like;
  const dislike = req.body.dislike;

  try {
    const signedUser = await usersList.find({
      name: req.session.name
    }).toArray();

    // het hele object van de gematchte user wordt uit de database gehaald
    // zodat je alleen de user die je hebt geliked/matched op de match pagina te zien krijgt
    const match = await usersList.find({
        name: req.body.like,
      })
      .toArray();
    // updateUsers wordt aangeroepen waarbij een argument wordt meegegeven
    // als de gematchte waarde true is, dan heb je een match en wordt gerenderd naar match route
    if (match[0]) {
      updateLikedUsers(like, signedUser)
      console.log(`you have a match with ${match[0].name} `);
      res.render('match', {
        users: match
      });
      // als de gematchte waarde false is, wordt je teruggestuurd naar de index
    } else {
      updateDislikedUsers(dislike, signedUser)
      console.log(`no match.`);
      res.redirect('/');
    }
  } catch (error) {
    next(error);
  }
};

// profile pagina van de gematchte baby wordt revealed naar de volwassen jochie.
async function profile(req, res, next) {
  try {
    const signedUser = await usersList.find({
      name: req.session.name
    }).toArray();
    const allLikedBabies = signedUser[0].liked;
    // zorgt voor dat de array niet telt vanaf 0
    // en die waarde wordt in likedUser meegegeven als de index
    const likedBaby = allLikedBabies.length - 1;
    const likedUser = allLikedBabies[likedBaby];
    // hele object van de gelikete user wordt uit de database gehaald
    const showMatch = await usersList.find({
      name: likedUser
    }).toArray();
    // rendert de gelikete user naar de profile pagina
    res.render('profile', {
      users: showMatch
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

// rendert error pagina
app.get('/*', (req, res) => {
  res.status(404).render('error');
});

// Application running on port...
