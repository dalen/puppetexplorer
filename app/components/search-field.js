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
    constructor($state, $stateParams, $http, puppetDB) {
      this.$state = $state;
      this.$http = $http;
      this.puppetDB = puppetDB;

      this.query = $stateParams.query;
    }

    isLoading() {
      return this.$http.pendingRequests.length !== 0;
    }

    submit() {
      // cancel all requests
      this.puppetDB.cancel();

      // FIXME: Catch errors here and show error ourself
      //        Also clear previous error on submit
      const apiQuery = this.puppetDB.parse(this.query);
      this.onUpdate({ query: apiQuery });

      // Change view to nodes if we are on dashboard
      if (this.$state.includes('root.dashboard')) {
        this.$state.go('root.nodes', { query: this.query });
      } else {
        this.$state.go(this.$state.current, { query: this.query });
      }
    }
  },
};
