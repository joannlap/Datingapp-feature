const express = require('express')
const router = express.Router()

//loads the different routes in the routing folder
const aboutPage = require('./routing/about.js')
const profilePage = require('./routing/profile.js')
const error = require('./routing/404error.js')

//aboutpage route
router.get('/about', (req, res) => {
  res.send("about the Pixby")
})
//contactpage route
router.get('/profile', (req, res) => {
  res.send("information about the user")
})
//404error route
router.get('/404error', (req, res) => {
  res.send("oopsie not working")
})

module.exports = router;