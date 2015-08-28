angular.module('app').controller 'MenuCtrl', class
  constructor: (@$scope, @$rootScope, @$location, @PuppetDB) ->
    @$scope.server = @PuppetDB.server()
    @servers = @PuppetDB.servers

  currentView: () ->
    @$location.path().split('/')[1]

  view: (path) ->
    if path
      @$location.path path
      @$location.search('page', null) # Clear page when switching
    else
      @$location.path().split('/')[1]

  setServer: (server) ->
    @PuppetDB.server(server)
    @$rootScope.$broadcast('queryChange') # Not technically, but we have to do the same things
