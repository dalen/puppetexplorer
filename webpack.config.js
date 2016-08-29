/* eslint no-param-reassign: ["error", { "props": false }] */
const path = require('path');

module.exports = {
  watch: true,
  entry: [
    path.resolve(__dirname, 'src', 'main.js'),
    path.resolve(__dirname, 'src', 'config.js.example'),
    path.resolve(__dirname, 'src', 'index.html'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
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
    contentBase: path.resolve(__dirname, 'dist'),
    colors: true,
    // inline: true,
    historyApiFallback: true,
    // lazy: true,
    proxy: {
      '/api/*': {
        target: 'http://puppetdb.puppetexplorer.io',
        rewrite: (req) => {
          req.url = req.url.replace(/^\/api/, '');
        },
      },
    },
  },
};
