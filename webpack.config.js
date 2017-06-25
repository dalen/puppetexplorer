/* eslint flowtype/require-valid-file-annotation: off */
/* eslint import/no-commonjs: off */
/* eslint fp/no-mutation: ["error", { "commonjs": true }] */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  watch: true,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src', 'main.jsx'),
    path.resolve(__dirname, 'src', 'config.js.example'),
    path.resolve(__dirname, 'src', 'index.html'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.re'],
  },
  // use imports loader to add whatwg-fetch polyfill
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(re|ml)$/,
        use: 'bs-loader?module=es6',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'html-loader',
            options: {
              attrs: 'img:src',
              link: 'href',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'file-loader',
          'extract-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(svg|ttf|woff|woff2|eot)$/,
        use: 'file-loader',
      },
      {
        test: /\.ico$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /config\.js\.example$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  devServer: {
    inline: true,
    historyApiFallback: {
      disableDotRule: true, // certnames usually contain dots
    },
    proxy: {
      '/api': {
        target: process.env.PUPPETDB_URL || 'http://puppetdb.puppetexplorer.io',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
