exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  specs: ['*_spec.js'],
  capabilities: {
    browserName: 'chrome',
    name: 'Puppet Explorer',
  },
};
