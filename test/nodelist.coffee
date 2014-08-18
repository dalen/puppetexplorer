describe 'Node list', ->
  before ->
    casper.start 'http://localhost:8001/#/nodes'

  it 'should display a list of nodes', ->
    casper.then ->
      'document.querySelectorAll("tr").length'.should.evaluate.to.be.above(0)

  it 'should display a warning if it cannot find any nodes', ->
    casper.then ->
      '#node-query-field'.should.be.inDOM.and.be.visible
      @fill 'form#node-query',
        query: 'foo=bar and foo!=bar'
      , true

    casper.then ->
      'div.alert.alert-warning'.should.be.inDOM.and.be.visible
      'div.alert.alert-warning'.should.have.text /No nodes found/
