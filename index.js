// variables
const hbs = require('hbs');
const express = require('express'); // inladen van express package
const bodyParser = require('body-parser');
const app = express(); // opstarten van express applicatie
const port = 4000; // adres van je webserver
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
// .use(express.json());
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

// renders home page of all the boys
// hier weergeeft hij alle gebruikers op de indexpagina, maar zou hier de id's al niet meegegeven moeten worden?
// Hoe weet hij anders welke knop bij welke id hoort?
const test = 'joann';
const dummyUser = (user) => user.name === test;

app.get('/', async (req, res, next) => {
  try {
    // zoekt door de database naar de userList
    const usersCollection = await usersList.find().toArray();
    // haalt de geregistreerde gebruiker uit de array
    const exclDummyUser = usersCollection.filter(dummyUser);
    const boyLiked = exclDummyUser[0].liked;
    const allBoys = await usersList.find({
      $and: [{
        name: {
          $ne: exclDummyUser[0].name
        },
      }, {
        id: {
          $nin: Object.values(boyLiked)
        },
      }]
    }).toArray();
    res.render('index', {
      title: 'home',
      users: allBoys
    });
  } catch (err) {
    next(err);
  }
});



// redirects to homepage when clicking on keepswiping button
app.post('/', async (req, res, next) => {
  try {
    const allBoys = await usersList.find({}).toArray();
    res.render('index', {
      title: 'home',
      users: allBoys
    });
  } catch (err) {
    next(err);
  }
});

// dit moet de update functie worden hahaha
// const updateUser = (user, input) => {

//   if (input.like) {
//     usersList.updateOne({
//       id:
//     })
//   }
// }

// match route should update te person who is liked
// hier moet de id meegegeven worden en geupdatet vanuit de gelikete button uit de index
app.post('/match', async (req, res, next) => {
  try {
    const database = await usersList.find().toArray();
    const dummyOutList = database.filter(dummyUser);
    const thisUser = dummyOutList[0];
    const likedId = req.body.id;
    const id = parseInt(likedId, 10);

    await usersList.updateOne({
      id: thisUser.id
    }, {
      $push: {
        liked: id
      }
    });

    console.log(dummyOutList[0]);

    console.log(likedId);
    const allBoys = await usersList.find({
      $and: [{
        name: {
          $ne: dummyOutList[0].name,
        },
      }, {
        id: {
          $nin: Object.values(boyLiked)
        },
      }]
    }).toArray();
    res.render('match', {
      users: allBoys
    });
  } catch (err) {
    next(err);
  }
});

// based on the matched baby picture should reveal the real identity of the match
// van diezelfde id uit de match moet hij renderen naar de profielpagina
app.post('/profile', async (req, res, ) => {
  try {
    const usersCollection = await usersList.find().toArray();
    const exclDummyUser = usersCollection.filter(dummyUser);
    let boyLiked = exclDummyUser[0].liked;
    console.log(boyLiked);
    let last_boyLiked = boyLiked.length - 1;
    const thisUser = exclDummyUser[0];
    console.log(thisUser);

    const allBoys = await usersList.find({
      id: last_boyLiked
    }).toArray();
    res.render('profile', {
      users: allBoys
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