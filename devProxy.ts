import * as proxy from 'http-proxy-middleware';
import * as Bundler from 'parcel-bundler';
import * as express from 'express';
import * as getPort from 'get-port';
import * as open from 'open';

const bundler = new Bundler('src/index.html');
const app = express();

app.use(
  '/api',
  proxy({
    target: process.env.PUPPETDB_URL || 'http://puppetdb.puppetexplorer.io',
    pathRewrite: { '^/api': '' },
  }),
);

getPort().then(port => {
  const url = `http://localhost:${port}`;
  console.log(`Serving application on ${url}\n`);
  app.use(bundler.middleware());
  open(url);
  app.listen(port);
});
