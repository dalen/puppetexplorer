/* eslint no-param-reassign: ["error", { "props": false }] */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  watch: true,
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'src', 'main.jsx'),
    path.resolve(__dirname, 'src', 'config.js.example'),
    path.resolve(__dirname, 'src', 'index.html'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  // use imports loader to add whatwg-fetch polyfill
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react'], // ['es2015', 'react'] for release build
          plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
        },
      },
      {
        test: /\.html$/,
        loaders: [
          'file?name=[name].[ext]',
          'extract',
          'html?attrs=img:src link:href',
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'file',
          'extract',
          'css',
        ],
      },
      {
        test: /\.(svg|ttf|woff|woff2|eot)$/,
        loader: 'file',
      },
      {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /config\.js\.example$/,
        loader: 'file?name=[name].[ext]',
      },
    ],
  },
  devServer: {
    colors: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://puppetdb.puppetexplorer.io',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
