
const prismic = require('prismic-nodejs')
// const cache = require('../libs/cache')
const pris = require('../libs/prismic')
const config = require('../config/default')

module.exports = (app) => {
  app.get(['/', '/page/:num'], async (req, res) => {
    try {
      // const content = await cache.read('articles')
      const sideList = await pris.sideList(req)
      // if (!content) {
      const articles = await req.prismic.api.query(
        prismic.Predicates.at('document.type', 'article'), {
          orderings: '[document.first_publication_date desc]',
          pageSize: 5,
          page: req.body.num || 1
        }
      )
      const content = pris.many(articles)
        // await cache.save('articles', content)
      // }
      res.render('home', {
        content,
        sideList,
        footer: config.fomtirth.social
      })
    } catch (error) {
      console.error(error)
      res.send(error)
    }
  })

  app.get('/:uid', async (req, res) => {
    try {
      let uid = req.params.uid
      const article = await req.prismic.api.getByUID('article', uid)
      const content = pris.one(article)
      const sideList = await pris.sideList(req)
      if (content) {
        res.render('article', {
          content,
          sideList,
          footer: config.fomtirth.social
        })
      }
    } catch (error) {
      console.error(error)
      res.send(error)
    }
  })
}
