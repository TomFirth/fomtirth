var app = require('express')()
var dust = require('dust')

pageNotFound = () => {
  var src = fs.readFileSync('/layout/404.dust', 'utf8')
  var compiled = dust.compile(src, 'Page Not Found')
  dust.loadSource(compiled)
  dust.render('Page Not Found', {}, function(err, out) {
    console.log(out)
  });
  return true
}

compileRender = (endpoint, jsonOutput) => {
  if (!_.isUndefined(endpoint) || !_.isUndefined(jsonOutput)) {
    var src = fs.readFileSync('/layout/' + endpoint + '.dust', 'utf8')
    var compiled = dust.compile(src, endpoint)
    dust.loadSource(compiled)
    dust.render(endpoint, jsonOutput, function(err, out) {
      console.log(out)
    });
  } else {
    pageNotFound()
  }
}

app.get('/', (req, res) => {
  // check if file exists
  // else 404
  // create jsonOutput
  var src = fs.readFileSync('/layout/index.dust', 'utf8')
  var compiled = dust.compile(src, 'Welcome')
  dust.loadSource(compiled)
  dust.render('Welcome', jsonOutput, function(err, out) {
    console.log(out)
  });
  return true
})

app.get('/:endpoint', (req, res) => {
  // jsonOutput = generateContent(res)
  // compileRender(res.endpoint, jsonOutput)
  return true
})

app.get('/:endpoint/:id', (req, res) => {
  // jsonOutput = generateContent(res)
  // compileRender(res.endpoint, jsonOutput)
  return true
})

app.listen(3000)
