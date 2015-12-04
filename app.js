const fetch = require('node-fetch')
const express = require('express')
const jwt = require('express-jwt')

const whitelist = require('./middleware/whitelist')
const sorted = require('./middleware/sort')
const filter = require('./middleware/filter')

const app = express()

app.use(whitelist)
app.use(sorted)
app.use(filter)

app.get('/participants', jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_AUDIENCE
}), (req, res) => {
  fetch('http://raw.githubusercontent.com/jsstrn/ga-wdi-class/gh-pages/js/data.json')
    .then(data => data.json())
    .then(json => [].concat(
      json.students,
      json.instructors
    ))
    .then(participants => res.json(participants))
})

module.exports = app
