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
const session = require('express-session');
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;
let db = null;
let usersList = null;

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

// indexpagina
// fake user wordt aangemaakt
const test = 'joann';
const dummyUser = (user) => user.name === test;

app.get('/', async (req, res, next) => {
  try {
    // alle gebruikers worden uit de database gehaald
    const fromDatabase = await usersList.find().toArray();
    // filtert alle gebruikers uit de array en houdt alleen dummyUser
    const getsDummyUser = fromDatabase.filter(dummyUser);
    // alle gebruikers uit de database gehaald zonder dummyUser mee te nemen
    const allBabies = await usersList.find({
      $and: [{
        name: {
          $ne: getsDummyUser[0].name
        },
      }, {
        id: {
          // array waar alle gelikete users in worden opgeslagen later
          $nin: Object.values(getsDummyUser[0].liked)
        },
      }, {
        id: {
          // array waar alle dislikete users in worden opgeslagen later
          $nin: Object.values(getsDummyUser[0].disliked)
        },
      }]
    }).toArray();
    console.log(allBabies);
    // allBabies wordt gerendert naar de index
    res.render('index', {
      title: 'home',
      users: allBabies
    });
  } catch (error) {
    next(error);
  }
});


// gelikete user wordt doorgestuurd naar match pagina
app.post('/match', async (req, res, next) => {
  try {
    // alle gebruikers worden uit de database gehaald
    const fromDatabase = await usersList.find().toArray();
    // filtert alle gebruikers uit de array en houdt alleen dummyUser
    const getsDummyUser = fromDatabase.filter(dummyUser);
    // definieert ingelogde user object met index 0
    const signedUser = getsDummyUser[0];
    // haalt de inputwaarde (id) vanuit de client side naar de server
    const likedId = req.body.like;
    const disLikedId = req.body.dislike;
    // verandert de string waarde naar een id
    const turnIdLike = parseInt(likedId, 10);
    const turnIdDislike = parseInt(disLikedId, 10);

    // Op het moment wammeer je iemand liked of disliked
    // wordt het hele object van de gebruiker gepusht naar je liked of disliked array
    const updateUsers = () => {
      if (req.body.like) {
        usersList.updateOne({
          id: signedUser.id
        }, {
          $push: {
            liked: turnIdLike
          }
        });
        return true;
      } else if (req.body.dislike) {
        usersList.updateOne({
          id: signedUser.id
        }, {
          $push: {
            disliked: turnIdDislike
          }
        });
        return false;
      }
    };

    // het hele object van de gematchte user wordt uit de database gehaald
    // zodat je alleen de user die je hebt geliked/matched op de match pagina te zien krijgt
    const match = await usersList.find({
        id: turnIdLike,
      })
      .toArray();

    // updateUsers wordt aangeroepen waarbij een argument wordt meegegeven
    // object van user wordt meegegeven aan de functie zodat de id kan worden defined
    // als de gematchte waarde true is, dan heb je een match en wordt gerenderd naar match route
    if (updateUsers(signedUser) === true) {
      console.log(`you have a match with ${match[0].name}`);
      res.render('match', {
        users: match
      });
      // als de gematchte waarde false is, wordt je teruggestuurd naar de index
    } else if (updateUsers(signedUser) === false) {
      console.log(`no match.`);
      res.redirect('/');
    }
  } catch (error) {
    next(error);
  }
});

// profile pagina van de gematchte baby wordt revealed naar de volwassen jochie.
app.post('/profile', async (req, res, ) => {
  try {
    // alle gebruikers worden uit de database gehaald
    const fromDatabase = await usersList.find().toArray();
    // filtert alle gebruikers uit de array en houdt alleen dummyUser
    const exclDummyUser = fromDatabase.filter(dummyUser);
    // de array waar alle gelikete users worden opgeslagen
    const allLikedBabies = exclDummyUser[0].liked;

    // zorgt voor dat de array niet telt vanaf 0
    // en die waarde wordt in likedUser meegegeven als de index
    const likedBaby = allLikedBabies.length - 1;
    const likedUser = allLikedBabies[likedBaby];
    // console.log(likedBaby)
    // console.log(likedUser)

    // hele object van de gelikete user wordt uit de database gehaald
    const showMatch = await usersList.find({
      id: likedUser
    }).toArray();
    // rendert de gelikete user naar de profile pagina
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