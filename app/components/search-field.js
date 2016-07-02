export const searchField = {
  /* bindings: {
    query: '<',
  }, */

  template: `
    <form ng-submit="$ctrl.submit()" id="node-query">
      <div class="input-group">
        <span class="input-group-addon" style="border-radius: 0">
          <span ng-class="$ctrl.isLoading() ? 'glyphicon glyphicon-refresh spin' : 'glyphicon glyphicon-search'"></span>
        </span>
        <input class="form-control" style="border-radius: 0" type="search" placeholder="Search" ng-model="$ctrl.query" name="query" id="node-query-field">
      </div>
    </form>
  `,

  controller: class {
    constructor($http, $location, $rootScope) {
      this.$http = $http;
      this.$location = $location;
      this.$rootScope = $rootScope;
    }

    isLoading() {
      return this.$http.pendingRequests.length !== 0;
    }

    submit() {
      this.$location.search('query', this.query);

      this.$rootScope.$broadcast('queryChange', { query: this.query });

      // Change view to nodes if we are on dashboard
      if (this.$location.path() === '/dashboard') { this.$location.path('/nodes'); }
    }
  },
};
