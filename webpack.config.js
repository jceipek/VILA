module.exports = {
  entry: './index.jsx',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js', //this is the default name, so you can skip it
    //at this directory our bundle file will be available
    //make sure port 8090 is used when launching webpack-dev-server
    publicPath: 'http://localhost:8090/assets'
  },
  module: {
    loaders: [
      { test: /\.js$|\.jsx$|\.pegjs$/
      , loader: '6to5-loader'
      }
    // , {
    //     //tell webpack to use jsx-loader for all *.jsx files
    //     test: /\.jsx$/
    //   , loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    //   }
    , {
        //use langloader for all *.pegjs files
        test: /\.pegjs$/
      , loader: 'pegjs-loader'
      }
    ]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.pegjs']
  }
}