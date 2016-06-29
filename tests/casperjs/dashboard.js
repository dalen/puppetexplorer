casper.test.begin('Dashboard', 3, function (test) {
  casper.start('http://localhost:8001/', function () {
    test.assertUrlMatch(/\/#\/dashboard/, 'redirect to the dashboard when opening');
  }).waitWhileVisible('span.glyphicon.spin', function () {
    test.assertMatch(this.fetchText('div.panel-body'), /^[\d,\.]+\s*%?$/, 'panels contain metrics');
  }).then(function () {
    this.fill('form#node-query', { query: 'kernel=Linux' }, true);
    test.assertUrlMatch(/\/#\/nodes/, 'redirect to node list when entering a query');
  }).run(function () {
    test.done();
  });
});
