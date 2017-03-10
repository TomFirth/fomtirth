'use:strict'

const path = require('path')

module.exports = {
  name: 'client',
  target: 'web',
  context: path.join(__dirname, '/app'),
  entry: {
    javascript: './js/app.js',
    html: './index.html'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist')
  },
  resolve: {
    extensions: [
      '.js', '.jsx', '.css', '.html', '.json'
    ]
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loaders: ["react-hot-loader", "babel-loader"]
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
}
