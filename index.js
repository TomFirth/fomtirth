var bodyParser = require('body-parser')
var dotenv = require('dotenv')
var errorHandler = require('errorhandler')
var express = require('express')
var app = express()
var methodOverride = require('method-override')
var _ = require('lodash')
var logger = require('morgan')
var path = require('path')
var prismic = require('prismic-nodejs')
var favicon = require('serve-favicon')

var conf = require('./config/default')
var configuration = require('./prismic-configuration')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
app.use(favicon('images/punch.png'))
app.use(logger('dev'))
app.use(bodyParser())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use(errorHandler())

require('dotenv').config()

var port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(port, 'belones to us')
})

app.use((req, res, next) => {
  prismic.api(configuration.apiEndpoint, {accessToken: configuration.accessToken, req})
    .then(api => {
      req.prismic = {api}
      res.locals.ctx = {
        endpoint: configuration.apiEndpoint,
        linkResolver: configuration.linkResolver
      }
      next()
    }).catch(err => {
      if (err.status === 404) {
        res.status(404).send('There was a problem connecting to your API, please check your configuration file for errors.')
      } else {
        res.status(500).send('Error 500: ' + err.message)
      }
    })
})

app.get(['/', '/blog'], (req, res) => {
  req.prismic.api.query(
    prismic.Predicates.at('document.type', 'blog'),
    { orderings : '[date desc]', pageSize : 50, page : 1 }
  )
  .then((res) => {
    if (res) {
      var articles = []
      _.forEach(res.results, (article) => {
        articles.push({
          uid: article.uid,
          title: article.uid,
          type: article.type,
          slug: article.slug,
          data: article.data['blog.richtext'].value[0].text
        })
      })
      return articles
    } else {
      res.status(404).send('Not found')
    }
  })
  .then((articles) => {
    // build page content object
    var content = {
      title: 'blog',
      pageDescription: conf.fomtirth.pages['blog'],
      prismicDocs: articles
    }
    res.render('post', content)
  })
})

app.get('/blog/:uid', (req, res) => {
  var uid = req.params.uid
  req.prismic.api.getByUID('document.type', uid).then(post => {
    if (post) {
      res.render('post', {post: post})
    } else {
      res.status(404).send('Not found')
    }
  })
})
