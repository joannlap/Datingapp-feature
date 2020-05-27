// variables
const hbs = require('hbs');
const express = require('express'); // inladen van express package

const app = express(); // opstarten van express applicatie
const port = 4000; // adres van je webserver
const path = require('path');
require('dotenv').config();
const mongo = require('mongodb');

const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
let db = null;
let usersList = null;
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_URL}`;

app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public')) // gebruikt deze map (public) om html bestanden te serveren
  .use(express.json());

hbs.registerPartials(path.join(__dirname, '/views/partials'));

// different routes of static pages
// Hbs tranformeert hbs files naar .html en vertsuurd deze naar public folder

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  // deze functie limiteert de file-type naar images alleen
  imageFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files allowed!'));
    }
    cb(null, true);
  },
});

// Multer middleware die single file upload 'profile-pic' naar database
app.use(
  router.post('/test', upload.single('profile-pic'), async (req, res) => {
    const photo = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250
      })
      .png()
      .toBuffer();
    db.collection('users')
      .insertOne({
        pic: photo,
      }, )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    res.send('done');
  })
);

// retrieve list of images
// app.get('/images', async (req, res) => {
//   try {
//     const photo = await sharp(req.file.buffer);
//     res.send(photo.data);
//   } catch (err) {
//     res.sendStatus(400);
//   }
// });

// retrieve images by id
// app.get('/images/:id', async (req, res) => {
//   try {
//     const photo = await sharp(req.file.buffer);
//     const result = photo.get(req.params.id);

//     if (!result) {
//       res.sendStatus(404);
//       return;
//     }
//     res.setHeader('Content-Type', result.mimetype);
    // fs.createReadStream(path.join('public/img/components', result.filename)).pipe(res);
//   } catch (err) {
//     res.sendStatus(400);
//   }
// });
// https://scotch.io/tutorials/express-file-uploads-with-multer

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

// laadt de indexpagina

app.get('/', async (req, res, next) => {
  try {
    const allUsers = await usersList.find({}).toArray();
    // console.log(exclMe);
    res.render('index', {
      title: 'home',
      users: allUsers
    });
  } catch (err) {
    next(err);
  }
});


// res.render => naar pagina
// res.redirect => naar route

app.post('/match', (req, res) => {
  res.render('match', {
    title: 'match',
  });
});

app.get('/match-list', (req, res) => {
  res.render('match-list', {
    title: ' match-list',
  });
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

app.get('/*', (req, res) => {
  res.status(404).render('error');
});

// Application running on port...
app.listen(port, () => console.log(`app draait op port ${port}!!`));