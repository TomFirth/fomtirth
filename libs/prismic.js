const configuration = require('../prismic-configuration')

const pris = module.exports = {}

pris.conn = async (api, req, res, next) => {
  req.prismic = {api}
  res.locals.ctx = {
    endpoint: configuration.apiEndpoint,
    linkResolver: configuration.linkResolver
  }
  next()
}

pris.one = async (post) => {
  let repository = null
  let url = null
  let video = null
  if (post.data['article.repository']) repository = post.data['article.repository'].value.url
  if (post.data['article.url']) url = post.data['article.url'].value.url
  if (post.data['article.video']) video = post.data['article.video'].value.url
  const content = {
    title: post.data['article.title'].value[0].text,
    description: post.data['article.description'].value,
    image: post.data['article.image'].value.main.url,
    repository,
    url,
    video
  }
  return content
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
