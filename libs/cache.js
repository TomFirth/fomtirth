const flatCache = require('flat-cache')
const flat = flatCache.load('fomtirth')

const cache = module.exports = {}

cache.save = async (key, obj) => {
  try {
    await flat.setKey(key, obj)
    await flat.save()
    return true
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

cache.read = async (key) => {
  try {
    const getCache = await flat.getKey(key)
    return getCache
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
