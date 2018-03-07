const flatCache = require('flat-cache')
const flat = flatCache.load('fomtirth')

const cache = module.exports = {}

cache.save = async (obj) => {
  try {
    await flat.setKey('articles', obj)
    await flat.save()
    return true
  } catch (error) {
    throw error
  }
}

cache.read = async () => {
  try {
    const getCache = await flat.getKey('articles')
    return getCache
  } catch (error) {
    throw error
  }
}
