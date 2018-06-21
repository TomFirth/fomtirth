const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')
const prismic = require('prismic-nodejs')
const pris = require('./libs/prismic')

const configuration = require('./prismic-configuration')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({
  extended: true
}))

const env = process.env.NODE_ENV || 'development'
if (env === 'development') require('dotenv').config()

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`${port} belongs to us`)
})

app.use(async (req, res, next) => {
  try {
    const api = await prismic.api(configuration.apiEndpoint, {accessToken: configuration.accessToken, req})
    pris.conn(api, req, res, next)
  } catch (error) {
    console.error(error)
    res.status(error.status).send(error.message)
  }
})

require('./routes')(app)
