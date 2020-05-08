const express = require('express')
const router = express.Router()

//loads the different routes in the routing folder
const aboutPage = require('./routing/about.js')
const contactPage = require('./routing/contact.js')
const error = require('./routing/404error.js')

//aboutpage route
router.get('/about', aboutPage)
//contactpage route
router.get('/contact', contactPage)
//404error route
router.get('/404error', error)

module.exports = router;
