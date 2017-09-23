var bodyParser = require('body-parser')
var express = require('express')
var app = express()
var _ = require('lodash')
var path = require('path')
var prismic = require('prismic-nodejs')

var configuration = require('./prismic-configuration')
var conf = require('./config/default')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({
  extended: true
}))

require('dotenv').config()

var port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`${port} belongs to us`)
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
      res.status(404).send('Prismic configuration errored')
    } else {
      res.status(500).send('Error 500: ' + err.message)
    }
  })
})

app.post('/search', (req, res) => {
  // search
  res.redirect('/')
})

app.get('/', (req, res) => {
  req.prismic.api.query(
    prismic.Predicates.at('document.type', 'article'),
    { orderings: '[date desc]', pageSize: 5, page: 1 }
  )
  .then((res) => {
    if (res) {
      var articles = []
      _.forEach(res.results, (article) => {
        articles.push({
          uid: article.uid,
          title: _.head(article.data['article.title'].value).text,
          description: _.head(article.data['article.description'].value).text,
          image: article.data['article.image'].value.main.url
        })
      })
      return articles
    } else {
      res.status(404).send('Not found')
    }
  })
  .then((articles) => {
    var content = {
      prismicDocs: articles,
      footer: conf.fomtirth.social
    }
    res.render('home', content)
  })
})

app.get('/:uid', (req, res) => {
  var uid = req.params.uid
  req.prismic.api.getByUID('article', uid)
  .then(post => {
    if (post) {
      let repository = null
      let url = null
      let video = null
      if (post.data['article.repository']) {
        repository = post.data['article.repository'].value.url
      }
      if (post.data['article.url']) {
        url = post.data['article.url'].value.url
      }
      if (post.data['article.video']) {
        video = post.data['article.video'].value.url
      }
      var content = {
        title: _.head(post.data['article.title'].value).text,
        description: _.head(post.data['article.description'].value).text,
        image: post.data['article.image'].value.main.url,
        repository,
        url,
        video,
        footer: conf.fomtirth.social
      }
      res.render('article', content)
    } else {
      res.status(404).send('Not found')
    }
  })
})
