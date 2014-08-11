describe 'Dashboard', ->
  before ->
    casper.start 'http://localhost:8000/'

  it 'should redirect to the dashboard', ->
    casper.then ->
      expect(/\/#\/dashboard/).to.matchCurrentUrl

  it 'should display four metrics', ->
    casper.then ->
      'document.querySelectorAll("div.panel-body").length'.should.evaluate.to.equal(4)
      'div.panel-body'.should.have.text /^[\d,\.]+\s*%?$/

  it 'should redirect to node list when entering a query', ->
    casper.then ->
      '#node-query-field'.should.be.inDOM.and.be.visible
      @fill 'form#node-query',
        query: 'kernel=Linux'
      , true

    casper.then ->
      expect(/\/#\/nodes/).to.matchCurrentUrl
