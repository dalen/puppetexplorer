/* global angular */
angular.module('app').controller('SearchCtrl', class {
  constructor($scope, $rootScope, $location) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$scope.query = this.$location.search().query;
    this.$scope.$on('$locationChangeSuccess', () => {
      const old = this.$scope.query;
      this.$scope.query = this.$location.search().query;
      if (old !== this.$scope.query) {
        this.$rootScope.$broadcast('queryChange', { query: this.$scope.query });
      }
    });
    // Reset filters on query change
    this.$rootScope.$on('queryChange', () => {
      this.$location.search('containing_class', null);
      this.$location.search('resource_type', null);
      this.$location.search('status', null);
      return this.$location.search('node', null);
    });
  }

  submit() {
    this.$location.search('query', this.$scope.query);

    this.$rootScope.$broadcast('queryChange', { query: this.$scope.query });

    // Change view to nodes if we are on dashboard
    if (this.$location.path() === '/dashboard') { this.$location.path('/nodes'); }
  }
});
