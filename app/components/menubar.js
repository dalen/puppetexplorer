export default {
  template: `
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
      <div class="container-fluid">
        <ul class="nav navbar-nav">
          <li ui-sref-active="active">
            <a ui-sref="root.dashboard" id="menu-dashboard">
              <span class="glyphicon glyphicon-dashboard"></span> Dashboard
            </a>
          </li>
          <li ui-sref-active="active">
            <a ui-sref="root.nodes" id="menu-nodes">
              <span class="glyphicon glyphicon-list"></span> Nodes
            </a>
          </li>
          <li ui-sref-active="active">
            <a ui-sref="root.events" id="menu-events">
              <span class="glyphicon glyphicon-calendar"></span> Events
            </a>
          </li>
          <li ui-sref-active="active">
            <a ui-sref="root.facts" id="menu-facts">
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
    constructor(puppetDB) {
      this.puppetDB = puppetDB;
      this.servers = this.puppetDB.serverNames();
    }

    setServer(server) {
      this.puppetDB.server(server);
    }
  },
};
