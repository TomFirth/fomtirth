var express = require('express')
var app = express()
var path = require('path')
var Prismic = require('prismic.io')
var _ = require('lodash')
var config = require('./config/default')

app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
var port = process.env.port || 8080

var con = {}
var articles = []

checkPage = (res) => {
  
  return many
}

// organise where content comes from
getContent = (res) => {
  var many = checkPage(res)
  getDocument(res.endpoint)
  return {
    pageTitle: res.req.params.endpoint,
    pageDescription: '',
    many
  }
}

// connect to and get prismic content
getDocument = (category) => {
  Prismic.api("https://fomtirth.prismic.io/api")
  .then((api) => {
    return api.query(""); // An empty query will return all the documents 
  })
  .then((response) => {
    _.forEach(response.results, (article) => {
      articles.push({
        uid: article.uid,
        title: article.uid,
        type: article.type,
        slug: article.slug,
        data: article.data['blog.richtext']
      })
    })
    console.log('++ articles', articles)
  }, (err) => {
    console.log("Something went wrong: ", err)
  })
}

app.get(['/', '/:endpoint', '/:endpoint/:uid'], (req, res) => {
  con = getContent(res)
  res.render(
    'page', con)
})

app.listen(port, () => {
    console.log('all your', port, 'r belong to us')
})
