var utilities = module.exports = {}
var Prismic = require('prismic.io')
var _ = require('lodash')
var Q = require('q')
var config = require('../config/default')

utilities.checkPage = (response) => {
  if (config.fomtirth.isMany.indexOf(response.req.params.endpoint) > -1 || _.isUndefined(response.req.params.endpoint)) {
    return true
  }
  return false
}

// organise where content comes from
utilities.getContent = (response) => {
  var articles = []
  if (category === 'favicon.ico') {
    var category = ''
  } else {
    var category = response.req.params.endpoint || 'blog'
  }
  var many = utilities.checkPage(response)
  Prismic.api("https://fomtirth.prismic.io/api")
  .then((api) => {
    // Prismic Query
    return api.query(
      Prismic.Predicates.at('document.type', category),
      { orderings : '[date desc]' }
    )
  })
  .then((response) => {
    // build object for Prismic articles
    _.forEach(response.results, (article) => {
      if ((category == article.type || category == article.uid)) {
        articles.push({
          uid: article.uid,
          title: article.uid.replace(/-/g, " "),
          type: article.type,
          slug: article.slug,
          data: article.data['blog.richtext'].value[0].text
        })
      }
    })
    return articles
  })
  .then((articles) => {
    // build page content object
    var content = {
      pageTitle: category,
      pageDescription: config.fomtirth.pages[category],
      many,
      prismicDocs: articles
    }
    console.log(content)
    // render page
    response.render(
      'page', content
    )
  })
  .catch((error) => {
    console.log('++ error', error)
  })
}
