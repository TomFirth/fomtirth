var express = require('express')
var app = express()
var path = require('path')
var prismic = require('./libs/prismic')

app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')

require('dotenv').config({ path: 'variables.env' });
var port = process.env.port || 8080
var content = {}

app.get('/favicon.ico', function(request, response) {
  response.sendStatus(204)
})

app.get(['/', '/:endpoint', '/:endpoint/:single'], (request, response) => {
  prismic.getPrismic(response)
})

app.listen(port, () => {
    console.log('all your', port, 'r belong to us')
})
