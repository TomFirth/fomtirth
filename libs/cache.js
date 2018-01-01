const fs = require('fs')

let articleArray = []

const cache = module.exports = {}

async function checkAge (articles) {
  fs.stat('./config/search.json', (error, stats) => {
    if (error) console.log('error', error)
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
  fs.readFile('file', 'utf8', function (err, data) {
    if (!err && json !== JSON.parse(data)) {
      fs.writeFile('./config/search.json', json, 'utf8', (err, data) => {
        if (err) console.log('++ write error', err)
        else console.log('++ written')
      })
    }
  })
}

cache.flow = (articles) => {
  return checkAge(articles)
  .then(getTitles(articles))
  .then(writeToJson(articleArray))
  .catch(err => {
    console.log('++ error', err)
  })
}
