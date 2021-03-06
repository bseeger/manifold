require("babel-polyfill");

var CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var assetsPath = path.resolve(__dirname, '../dist/build/client/build/');
var babelrc = fs.readFileSync('./.babelrc');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// Grab the babelrc config.
try {
  var babelrcTotal = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

// Select the correct babel environment to build the loader query.
var environment = __ENVIRONMENT__;
var babelRcEnv= babelrcTotal.env && babelrcTotal.env[environment]|| {};
var babelLoaderQuery = Object.assign({}, babelrcTotal, babelRcEnv);
delete babelLoaderQuery.env;
Object.assign(babelLoaderQuery, {cacheDirectory: true});


// Create the entries. If we're in dev, we want hot loading
var mainEntry = ['./src/client.js'];
var themeEntry = ['./src/theme/theme.js'];
if (__DEVELOPMENT__) {
  mainEntry.unshift('webpack/hot/only-dev-server');
  mainEntry.unshift(`webpack-dev-server/client?http://0.0.0.0:${process.env.CLIENT_ASSET_PORT}`);
  mainEntry.unshift('react-hot-loader/patch');
  themeEntry.unshift('webpack/hot/only-dev-server');
}

// Determine the public path
var publicPath;
if (__DEVELOPMENT__) {
  publicPath = '/build/client/build/';
} else {
  publicPath = '/';
}

// Set the plugins.
var plugins;
if (__DEVELOPMENT__) {
  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/)
  ];
} else {
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ];
  if (__CLIENT__ && __PRODUCTION__) {
    plugins.push(new ExtractTextPlugin("[name]-[hash].css"));
    plugins.push(new CopyWebpackPlugin([{
      from: path.join(__dirname, "..", "static"),
      to: "static"
    }]));
  }
}

if (__CLIENT__ && __PRODUCTION__) {
  plugins.push(new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }));
}

// Push those globals, yo.
plugins.push(new webpack.DefinePlugin({
    __API_URL__: '"' +  global.__API_URL__ + '"',
    __CABLE_URL__: '"' +  global.__CABLE_URL__ + '"',
    __CLIENT__: global.__CLIENT__,
    __SERVER__: global.__SERVER__,
    __DEVELOPMENT__: global.__DEVELOPMENT__,
    __DEVTOOLS__: global.__DEVELOPMENT__
  })
);

// Use full source maps in production and fast source maps in dev.
let devtool;
if (__DEVELOPMENT__) {
  devtool = "eval-source-map";
} else {
  devtool = "source-map";
}

// In dev we load CSS as javascript so we can hot reload it. In production, we extract
// it to a separate file using the ExtractTextPlugin
let scssLoader;
if (__CLIENT__ && __PRODUCTION__) {
  scssLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      "style",
      [
        "css?importLoaders=2",
        "postcss?syntax=postcss-scss",
        "sass?outputStyle=compact"
      ]
    ),
    include: path.resolve('./src')
  };
} else {
  scssLoader = {
    test: /\.scss$/,
    loaders: [
      'style',
      'css?importLoaders=2',
      'postcss?syntax=postcss-scss',
      'sass?outputStyle=expanded'
    ],
    include: path.resolve('./src')
  };
}


// Build the configuration
module.exports = {
  devtool: devtool,
  context: path.resolve(__dirname, '..'),
  entry: {
    'theme': themeEntry,
    'main': mainEntry
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: publicPath
  },
  resolveLoader: {
    alias: {
      "fontgen": path.join(__dirname, "./loaders/fontgen")
    }
  },
  sassLoader: {
    includePaths: [path.join(__dirname, "./src/theme")]
  },
  module: {
    loaders: [
      {
        test: /\.font.js/,
        loaders: ['style', 'css', 'fontgen'],
        include: path.resolve('./src')
      },
      { test: /\.js$/,
        loader: 'babel',
        include: path.resolve('./src'),
        query: babelLoaderQuery
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
        include: path.resolve('./src')
      },
      scssLoader,
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
        include: path.resolve('./src')
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
        include: path.resolve('./src')
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream",
        include: path.resolve('./src')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
        include: path.resolve('./src')
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml",
        include: path.resolve('./src')
      }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  plugins: plugins,
  postcss: function() {
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  }
};
