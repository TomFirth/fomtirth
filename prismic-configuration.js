module.exports = {

  apiEndpoint: 'https://fomtirth.prismic.io/api',

  // -- Access token if the Master is not open
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,

  // OAuth
  clientId: process.env.PRISMIC_CLIENT_ID,
  clientSecret: process.env.PRISMIC_CLIENT_SECRET,

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver (doc, ctx) {
    if (doc.type === 'article') {
      return '/' + encodeURIComponent(doc.uid)
    }
    return '/'
  }
}
