const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')
const prismic = require('prismic-nodejs')

const search = require('./libs/search')
const cache = require('./libs/cache')
const configuration = require('./prismic-configuration')
const conf = require('./config/default')
const searchCache = require('./config/search')

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

require('dotenv').config()

const port = process.env.PORT || 8080

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
  })
  .catch(err => {
    if (err.status === 404) {
      res.status(404).send('Prismic configuration errored')
    } else {
      res.status(500).send('Error 500: ' + err.message)
    }
  })
})

app.post('/', (req, res) => {
  searchCache.map(single => {
    if (single.title === req.body.search) {
      res.redirect(`/${single.uid}`)
    }
  })
})

app.get('/', (req, res) => {
  req.prismic.api.query(
    prismic.Predicates.at('document.type', 'article'),
    { orderings: '[document.first_publication_date desc]', pageSize: 5, page: 1 }
  )
  .then(res => {
    if (res) {
      let articles = []
      res.results.forEach(article => {
        articles.push({
          uid: article.uid,
          title: article.data['article.title'].value[0].text,
          description: article.data['article.description'].value[0].text,
          image: article.data['article.image'].value.main.url
        })
      })
      return articles
    } else {
      res.status(404).send('Not found')
    }
  })
  .then(articles => {
    cache.flow(articles)
    let content = {
      prismicDocs: articles,
      footer: conf.fomtirth.social,
      searchCache: search.readCache()
    }
    res.render('home', content)
  })
  .catch(error => {
    console.error(error)
  })
})

app.get('/:uid', (req, res) => {
  let uid = req.params.uid
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
      let content = {
        title: post.data['article.title'].value[0].text,
        description: post.data['article.description'].value,
        image: post.data['article.image'].value.main.url,
        repository,
        url,
        video,
        footer: conf.fomtirth.social,
        searchCache: search.readCache()
      }
      res.render('article', content)
    } else {
      res.status(404).send('Not found')
    }
  })
})
