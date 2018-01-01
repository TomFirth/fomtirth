const searchCache = require('../config/search')

const search = module.exports = {}

search.readCache = () => {
  let cacheArray = []
  searchCache.map(article => {
    cacheArray.push(article.title)
  })
  return cacheArray
}
