var bodyParser = require('body-parser')
var errorHandler = require('errorhandler')
var express = require('express')
var app = express()
var methodOverride = require('method-override')
var _ = require('lodash')
var path = require('path')
var prismic = require('prismic-nodejs')

var conf = require('./config/default')
var configuration = require('./prismic-configuration')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
app.use(bodyParser())
app.use(methodOverride())
app.use(errorHandler())

require('dotenv').config()

var port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(port, 'belongs to us')
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
    { orderings: '[date desc]', pageSize: 50, page: 1 }
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
    var content = {
      title: 'blog',
      description: conf.fomtirth.pages['blog'],
      prismicDocs: articles,
      single: false
    }
    res.render('post', content)
  })
})

app.get('/blog/:uid', (req, res) => {
  var uid = req.params.uid
  req.prismic.api.getByUID('blog', uid)
  .then(post => {
    if (post) {
      var articles = [
        post
      ]
      var content = {
        title: post.data.uid,
        description: conf.fomtirth.pages['blog'],
        prismicDocs: articles,
        text: _.head(post.data['blog.richtext'].value).text,
        single: true
      }
      res.render('post', content)
    } else {
      res.status(404).send('Not found')
    }
  })
})
