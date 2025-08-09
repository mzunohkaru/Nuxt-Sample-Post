const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

// Import routes
const account = require('./account')
const auth = require('./auth')
const posts = require('./posts')
const tests = require('./tests')

// Use routes
app.use('/account', account)
app.use('/auth', auth)
app.use('/posts', posts)
app.use('/tests', tests)

module.exports = app
