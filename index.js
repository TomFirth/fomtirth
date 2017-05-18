var express = require('express')
var app = express()
var hbs = require('handlebars')
var fs = require('fs')
var _ = require('lodash')
var path = require('path')

var errors = require('./config/errors')

var port = process.env.PORT || 8080
var jsonOutput = {}
var partialsDir = path.join(__dirname + '/layout/partial/')
var filenames = fs.readdirSync(partialsDir);

// register all partial templates
_.each(filenames, (filename) => {
  var matches = /^([^.]+).hbs$/.exec(filename)
  if (!matches) {
    return
  }
  var name = matches[1]
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8')
  hbs.registerPartial(name, template)
});

// this will be called after the file is read
render = (source, json) => {
  var template = hbs.compile(source)
  console.log('++ template', template)
  var output = template(json)
  return output
}

// populate content
generateContent = (res) => {
  return jsonOutput
}

// error
pageNotFound = (error) => {
  var source = '' // html
  var template = hbs.compile(source)
  var result = template(error)
}

// get template and render
compileRender = (endpoint, jsonOutput) => {
  if (!_.isUndefined(endpoint) || !_.isUndefined(jsonOutput)) {
    try {
      // read the file and use the callback to render
      fs.readFile(__dirname + '/layout/' + endpoint + '.hbs', (err, data) => {
        if (!err) {
          // make the buffer into a string
          var source = data.toString();
          // call the render function
          render(source, jsonOutput);
        } else {
          // handle file read error
        }
      });
    } catch (err) {
      console.log('Error', err)
      pageNotFound();
    }
  } else {
    pageNotFound()
  }
}

// index
app.get('/', (req, res) => {
  // create jsonOutput
  jsonOutput = generateContent(res)
  compileRender("index", jsonOutput)
  res.send()
})

// any page
app.get('/:endpoint', (req, res) => {
  jsonOutput = generateContent(res)
  compileRender(res.endpoint, jsonOutput)
  res.send()
})

// any page of page
app.get('/:endpoint/:id', (req, res) => {
  jsonOutput = generateContent(res)
  compileRender(res.endpoint, jsonOutput)
  res.send()
})

// yeeeaaaahhhhhh
app.listen(port)
console.log('all your', port + ', r belong to us') // shoutout to the user
exports = module.exports = app // expose app
