var utilities = module.exports = {}
var _ = require('lodash')
var config = require('../config/default')

utilities.checkPage = (response) => {
  if (config.fomtirth.isMany.indexOf(response.req.params.endpoint) > -1 || _.isUndefined(response.req.params.endpoint)) {
    return true
  }
  return false
}

utilities.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
