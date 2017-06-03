var express = require('express')
var app = express()
require('./config/routes')(app)
app.set('view engine', 'pug')
var port = process.env.port || 8080

app.listen(port, function () {
    console.log('all your', port, 'r belong to us')
})
