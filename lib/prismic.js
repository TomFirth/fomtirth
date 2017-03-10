'use strict'

const prismic = require('prismic-nodejs')

class Prismic {
  api (req, res) {
    res.locals.ctx = { // So we can use this information in the views
      endpoint: ENDPOINT,
      linkResolver: LINKRESOLVER
    }
    return Prismic.api(ENDPOINT, {
      accessToken: ACCESSTOKEN,
      req: req
    })
  }

  query () {
    api.query(
      Prismic.Predicates.at('document.type', 'blog-post'),
      { orderings: '[my.blog-post.date desc]' }
    )
    .then((blogPosts) => {
      // blogPosts is the response object, blogPosts.results holds the documents
    })
    .catch((err, res) => {
      // error
    })
  }

  getPage (req, res) {
    api(req)
    .then((api) => {
      api.getByUID('page', 'get-started', (err, document) => {
        if (err) {
      // error
        }
        res.render('index-prismic', {
          document: document
        })
      })
      .catch((err, res) => {
      // error
      })
    })
    .catch((err, res) => {
      // error
    })
  }

  getAllPosts (req, res) {
    // prismic all posts
  }

  getPostById (req, res) {
    // prismic post by id
  }
}
