/* global angular */
angular.module('app').controller('MenuCtrl', class {
  constructor($scope, $rootScope, $location, PuppetDB) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.PuppetDB = PuppetDB;
    this.$scope.server = this.PuppetDB.server();
    this.servers = this.PuppetDB.servers;
  }

  currentView() {
    return this.$location.path().split('/')[1];
  }

  // FIXME: Both getter and setter
  view(path) {
    if (path) {
      this.$location.path(path);
      this.$location.search('page', null); // Clear page when switching
    }
    return this.$location.path().split('/')[1];
  }

  setServer(server) {
    this.PuppetDB.server(server);
    // Not technically, but we have to do the same things
    this.$rootScope.$broadcast('queryChange');
  }
});
