module.exports = {

  apiEndpoint: 'https://fomtirth.prismic.io/api',

  // -- Access token if the Master is not open
  accessToken: 'MC5XTHN2VENjQUFKc1I0dEM3.Fe-_ve-_ve-_vQ4fbVluIe-_vREnGu-_vWfvv70KfSFUG--_vVbvv71R77-977-9De-_ve-_vVQ',

  // OAuth
  clientId: 'WLsvTCcAAJsR4tC6',
  clientSecret: '0e4a84142e5e7f5518cdc2c47fa394e0',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver (doc, ctx) {
    if (doc.type === 'blog') {
      return '/blog'
    }
    if (doc.type === 'post') {
      return '/blog/' + encodeURIComponent(doc.uid)
    }
    return '/'
  }
}
