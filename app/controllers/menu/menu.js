export class MenuCtrl {
  constructor($scope, $rootScope, $location, puppetDB) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.puppetDB = puppetDB;
    this.$scope.server = this.puppetDB.server();
    this.servers = this.puppetDB.servers;
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
    this.puppetDB.server(server);
    // Not technically, but we have to do the same things
    this.$rootScope.$broadcast('queryChange');
  }
}
