// variables
const
  hbs = require('hbs')
express = require('express') //inladen van express package
app = express() //opstarten van express applicatie
port = 4000 //adres van je webserver
yoMomma = require('yo-mamma').default //extern package
fatoe = yoMomma()
bodyParser = require('body-parser')
path = require('path')
require('dotenv').config()

app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
  .use(bodyParser.urlencoded({
    extended: true
  }));

hbs.registerPartials(path.join(__dirname, '/views/partials'))

// different routes of static pages
// Hbs tranformeert hbs files naar .html en vertsuurd deze naar public folder
const userData = [{
    name: 'Collin',
    id: 1,
    age: 21,
    location: 'Toronto, Canada',
    pic: 'collin.png',
    profession: 'Choreographer',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Brandon',
    id: 2,
    age: 21,
    location: 'Montreal, Canada',
    pic: 'brandon.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Cameron',
    id: 3,
    age: 21,
    location: 'Hamilton, Canada',
    pic: 'cameron.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Steven',
    id: 4,
    age: 21,
    location: 'Quebec, Canada',
    pic: 'steven.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Dwight',
    id: 5,
    age: 21,
    location: 'Vancouver, Canada',
    pic: 'dwight.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Dré',
    id: 6,
    age: 21,
    location: 'Toronto, Canada',
    pic: 'dre.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Zac',
    id: 7,
    age: 21,
    location: 'Mississauga, Canada',
    pic: 'zac.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
  {
    name: 'Bradley',
    id: 8,
    age: 21,
    location: 'Kitchener, Canada',
    pic: 'bradley.png',
    profession: '',
    about: '',
    interest: ['Dance', 'Cooking', 'Photography', 'Gaming'],
    liked: [],
    disliked: []
  },
]

//array wordt omgezet in Json format
const users = JSON.stringify(userData)
console.log(users)

const {
  MongoClient,
} = require('mongodb');
databaseName = 'pixby';
url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;

MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  } else if (client) {
    return console.log('database is connected')
  }

  const db = client.db(databaseName);

  // db.collection('users').insertMany(

  // ).then((result) => {
  //   console.log(result);
  // }).catch((error) => {
  //   console.log(error);
  // });
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'home',
    users: userData
  });
});

app.get('/match-list', (req, res) => {
  res.render('match-list', {
    title: ' match-list',
    users: userData
  })
})

// res.render => naar pagina
// res.redirect => naar route

//als je liked wordt je doorgestuurd naar de match pagina, zodra je disliked blijf je op de index
app.post('/match', (req, res) => {
  if (req.body.like) {
    res.render('match', {
      title: 'match',
      users: userData[0]
    })
    console.log(req.body.like)
  } else if (req.body.dislike) {
    res.redirect('/')
    console.log(req.body.dislike)
  }
})


//renders couple objects containing arrays to the profile.hbs
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


// Application running on port...
app.listen(port, function () {
  return console.log(`app draait op port ${port}!!`)
});

// home > match > profile > match overzicht