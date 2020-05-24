// variables
const
  hbs = require('hbs')
express = require('express') //inladen van express package
app = express() //opstarten van express applicatie
port = 3000 //adres van je webserver
yoMomma = require('yo-mamma').default //extern package
fatoe = yoMomma()
bodyParser = require('body-parser');
path = require('path')

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
    name: 'Aang',
    age: 17,
    profession: 'airbending'
  },
  {
    name: 'Zuko',
    age: 19,
    profession: 'firebending'
  },
  {
    name: 'Sokka',
    age: 19,
    profession: 'waterbending'
  },
]

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