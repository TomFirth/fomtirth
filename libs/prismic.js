var pris = module.exports = {}
var utilities = require('./utilities')
var Prismic = require('prismic.io')
var _ = require('lodash')
var Q = require('q')
var config = require('../config/default')

// organise where content comes from
pris.getPrismic = (response) => {
  var category = response.req.params.endpoint || 'blog'
  var documentType = 'document.type' // document.tags, 
  // in("document.uid, ["myuid1", "myuid2"])
  var articles = []
  var pagination = '1';
  if (response.req.params.single && _.isNumber(parseInt(response.req.params.single))) {
    pagination = response.req.params.single
    documentType = 'document.id'
  } else if (response.req.params.single && !_.isNumber(parseInt(response.req.params.single))) {
    category = response.req.params.single
  }
  var many = utilities.checkPage(response)
  Prismic.api("https://fomtirth.prismic.io/api")
  .then((api) => {
    // Prismic Query
    return api.query(
      Prismic.Predicates.at(documentType, category),
      { orderings : '[date desc]', pageSize : 50, page : pagination }
    )
  })
  .then((response) => {
    // build object for Prismic articles
    _.forEach(response.results, (article) => {
      if ((category == article.type || category == article.uid)) {
        articles.push({
          uid: article.uid,
          title: utilities.capitalizeFirstLetter(article.uid.replace(/-/g, " ")),
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
      pageTitle: utilities.capitalizeFirstLetter(category),
      pageDescription: config.fomtirth.pages[category],
      many,
      prismicDocs: articles
    }
    // render page
    response.render(
      'page', content
    )
  })
  .catch((error) => {
    console.log('++ error', error)
  })
}