describe 'Dashboard', ->
  before ->
    casper.start 'http://localhost:8001/'

  it 'should redirect to the dashboard', ->
    casper.then ->
      expect(/\/#\/dashboard/).to.matchCurrentUrl

  it 'should display metrics in all panels', ->
    casper.then ->
      'div.panel-body'.should.have.text /^[\d,\.]+\s*%?$/

  it 'should redirect to node list when entering a query', ->
    casper.then ->
      '#node-query-field'.should.be.inDOM.and.be.visible
      @fill 'form#node-query',
        query: 'kernel=Linux'
      , true

    casper.then ->
      expect(/\/#\/nodes/).to.matchCurrentUrl
