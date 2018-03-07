
const prismic = require('prismic-nodejs')
const cache = require('../libs/cache')
const pris = require('../libs/prismic')
const config = require('../config/default')

module.exports = (app) => {
  app.get('/', async (req, res) => {
    try {
      const content = await cache.read()
      if (!content) {
        const articles = await req.prismic.api.query(
          prismic.Predicates.at('document.type', 'article'), {
            orderings: '[document.first_publication_date desc]',
            pageSize: 5,
            page: 1
          }
        )
        const content = await pris.many(articles)
        await cache.save(content)
      }
      res.render('home', {
        content,
        footer: config.fomtirth.social
      })
    } catch (error) {
      res.status(error.status).send(error.message)
    }
  })

  app.get('/:uid', async (req, res) => {
    try {
      let uid = req.params.uid
      const article = await req.prismic.api.getByUID('article', uid)
      const content = await pris.one(article)
      res.render('article', {
        content,
        footer: config.fomtirth.social
      })
    } catch (error) {
      res.status(error.status).send(error.message)
    }
  })
}
