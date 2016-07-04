export const searchField = {
  bindings: {
    onUpdate: '&',
  },

  template: `
    <form ng-submit="$ctrl.submit()" id="node-query">
      <div class="input-group">
        <span class="input-group-addon" style="border-radius: 0">
          <span class="glyphicon"
            ng-class="$ctrl.isLoading() ? 'glyphicon-refresh spin' : 'glyphicon-search'"></span>
        </span>
        <input class="form-control" style="border-radius: 0" type="search" placeholder="Search"
          ng-model="$ctrl.query" name="query" id="node-query-field">
      </div>
    </form>
  `,

  controller: class {
    constructor($http, $location, puppetDB) {
      this.$http = $http;
      this.$location = $location;
      this.puppetDB = puppetDB;

      this.query = $location.search().query;
      if (this.query) {
        this.submit();
      }
    }

    isLoading() {
      return this.$http.pendingRequests.length !== 0;
    }

    submit() {
      this.$location.search('query', this.query);

      // FIXME: Catch errors here and show error ourself
      const apiQuery = this.puppetDB.parse(this.query);
      this.onUpdate({ query: apiQuery });

      // Change view to nodes if we are on dashboard
      if (this.$location.path() === '/dashboard') { this.$location.path('/nodes'); }
    }
  },
};
