module.exports = {
  entry: './src/serviceMiddleware.js',
  output: {
    filename: './lib/serviceMiddleware.js',
    library: 'inst-redux-service-middleware',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      }
    ]
  }
}
