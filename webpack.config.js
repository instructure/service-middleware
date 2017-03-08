const { resolve } = require('path')
const src = resolve(__dirname, 'src')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './lib/index.js',
    library: 'inst-redux-service-middleware',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: src,
        use: 'babel-loader'
      }
    ]
  }
}
