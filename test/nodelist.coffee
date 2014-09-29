describe 'Node list', ->
  beforeEach ->
    casper.start 'http://localhost:8001/'
    casper.then ->
      @click '#menu-nodes'

  it 'should display a list of nodes', ->
    casper.waitUntilVisible '#node-list', ->
      @getElementsInfo('tr').length.should.be.above(0)

  it 'should display a warning if it cannot find any nodes', ->
    casper.then ->
      '#node-query-field'.should.be.inDOM.and.be.visible
      @fill 'form#node-query',
        query: 'foo=bar and foo!=bar'
      , true

      @waitUntilVisible 'div.alert.alert-warning', ->
        'div.alert.alert-warning'.should.have.text /No nodes found/
