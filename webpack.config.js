const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HTMLPlugin({
      title: 'Puppet Explorer',
      favicon: 'src/favicon.ico',
      template: 'src/index.html',
    }),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
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
