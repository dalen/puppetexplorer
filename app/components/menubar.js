export const menubar = {
  template: `
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
      <div class="container-fluid">
        <ul class="nav navbar-nav">
          <li ng-class="$ctrl.currentView() == 'dashboard' ? 'active' : ''">
            <a ng-click="$ctrl.view('/dashboard')" id="menu-dashboard">
              <span class="glyphicon glyphicon-dashboard"></span> Dashboard
            </a>
          </li>
          <li ng-class="$ctrl.currentView() == 'nodes' ? 'active' : ''">
            <a ng-click="$ctrl.view('/nodes')" id="menu-nodes">
              <span class="glyphicon glyphicon-list"></span> Nodes
            </a>
          </li>
          <li ng-class="$ctrl.currentView() == 'events' ? 'active' : ''">
            <a ng-click="$ctrl.view('/events')" id="menu-events">
              <span class="glyphicon glyphicon-calendar"></span> Events
            </a>
          </li>
          <li ng-class="$ctrl.currentView() == 'facts' ? 'active' : ''">
            <a ng-click="$ctrl.view('/facts')" id="menu-facts">
              <span class="glyphicon glyphicon-stats"></span> Facts
            </a>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown" ng-if="$ctrl.servers.length > 1" dropdown>
            <a href="#" dropdown-toggle class="dropdown-toggle" data-toggle="dropdown">
              <span class="glyphicon glyphicon-hdd"></span> Server <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li ng-repeat="server in $ctrl.servers">
                <a ng-click="$ctrl.setServer(server)">{{server}}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  `,

  controller: class {
    constructor($rootScope, $location, puppetDB) {
      this.$rootScope = $rootScope;
      this.$location = $location;
      this.puppetDB = puppetDB;
      this.servers = this.puppetDB.serverNames();
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
  },
};
