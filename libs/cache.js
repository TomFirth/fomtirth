const fs = require('fs')

let articleArray = []

const cache = module.exports = {}

async function checkAge (articles) {
  fs.stat('./config/search.json', (error, stats) => {
    if (error) console.error(error)
    let now = new Date()
    let yesterday = now.setDate(now.getDate() - 1)
    if (yesterday > stats.mtime) {
      return { articles }
    }
  })
}

async function getTitles (articles) {
  if (articles.length > 0) {
    await articles.forEach(article => {
      articleArray.push({
        uid: article.uid,
        title: article.title
      })
    })
    return articleArray
  }
}

async function writeToJson (articleArray) {
  let json = JSON.stringify(articleArray)
  fs.readFile('./config/search.json', 'utf8', function (error, data) {
    if (error) console.error(error)
    if (json !== JSON.parse(data)) {
      fs.writeFile('./config/search.json', json, 'utf8', (error, data) => {
        if (error) console.error(error)
      })
    }
  })
}

cache.flow = (articles) => {
  return checkAge(articles)
  .then(getTitles(articles))
  .then(writeToJson(articleArray))
  .catch(error => {
    console.error(error)
  })
}
