const express = require('express')
const router = express.Router()

// const aboutPage = require('./routing/about.js')
// const contactPage = require('./routing/contact.js')
// const error = require('./routing/404error.js')

router.get('/about', aboutPage)
router.get('/contact', contactPage)
router.get('/404error', error)

module.exports = router;
