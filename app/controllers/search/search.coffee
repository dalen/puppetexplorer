angular.module("app").controller "SearchCtrl", class
  constructor: (@$scope, @$rootScope, @$location) ->
    @$scope.query = @$location.search().query
    @$scope.$on "$locationChangeSuccess", (event) =>
      old = @$scope.query
      @$scope.query = @$location.search().query
      if old isnt @$scope.query
        @$rootScope.$broadcast('queryChange', query: @$scope.query)
    # Reset filters on query change
    @$rootScope.$on 'queryChange', () =>
      @$location.search('containing_class', null)
      @$location.search('resource_type', null)
      @$location.search('status', null)
      @$location.search('node', null)

  submit: () ->
    @$location.search "query", @$scope.query

    @$rootScope.$broadcast('queryChange', query: @$scope.query)

    # Change view to nodes if we are on dashboard
    @$location.path "/nodes" if @$location.path() is "/dashboard"
