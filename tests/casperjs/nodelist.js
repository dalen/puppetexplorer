casper.test.begin('Node List', 2, function (test) {
  casper.start('http://localhost:8001/', function () {
    this.click('#menu-nodes');
  }).waitUntilVisible('#node-list', function () {
    test.assert(this.getElementsInfo('tr').length > 0, 'should display a list of nodes');
  }).then(function () {
    this.fill('form#node-query', { query: 'foo=bar and foo!=bar' }, true);
  }).waitUntilVisible('div.alert.alert-warning', function () {
    test.assertSelectorHasText('div.alert.alert-warning', 'No nodes found');
  }).run(function () {
    test.done();
  });
});
