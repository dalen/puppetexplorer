exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  specs: ['*_spec.js'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: '51.0',
      name: 'Puppet Explorer',
    },
    {
      browserName: 'firefox',
      version: '46.0',
      name: 'Puppet Explorer',
    },
    {
      browserName: 'safari',
      version: '9.0',
      platform: 'OS X 10.11',
      name: 'Puppet Explorer',
    },
  ],
};
