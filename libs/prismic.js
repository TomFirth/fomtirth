const _ = require('lodash')
const prismic = require('prismic-nodejs')
const configuration = require('../prismic-configuration')
const cache = require('../libs/cache')

const pris = module.exports = {}

pris.conn = async (api, req, res, next) => {
  req.prismic = {api}
  res.locals.ctx = {
    endpoint: configuration.apiEndpoint,
    linkResolver: configuration.linkResolver
  }
  next()
}

pris.sideList = async (req) => {
  try {
    const sideList = await cache.read('side')
    if (!sideList) {
      const articles = await req.prismic.api.query(
        prismic.Predicates.at('document.type', 'article'), {
          orderings: '[document.first_publication_date desc]',
          pageSize: 100,
          page: 1
        }
      )
      const sideList = await pris.side(articles)
      await cache.save('side', sideList)
    }
    return sideList
  } catch (error) {
    throw error
  }
}

pris.one = async (post) => {
  return {
    title: post.data['article.title'].value[0].text,
    description: post.data['article.description'].value,
    image: post.data['article.image'].value.main.url,
    repository: _.get(post, 'data["article.repository"].value.url') || null,
    url: _.get(post, 'data["article.url"].value.url') || null,
    video: _.get(post, 'data["article.video"].value.url') || null
  }
}

pris.many = async (articles) => {
  let content = []
  articles.results.forEach(article => {
    content.push({
      uid: article.uid,
      title: article.data['article.title'].value[0].text,
      description: article.data['article.description'].value[0].text + '..',
      image: article.data['article.image'].value.main.url
    })
  })
  return content
}

pris.side = async (articles) => {
  let content = []
  articles.results.forEach(article => {
    content.push({
      uid: article.uid,
      title: article.data['article.title'].value[0].text
    })
  })
  return content
}
