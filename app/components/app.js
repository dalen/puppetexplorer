export const app = {
  template: `
    <search-field on-update="$ctrl.queryChange(query)"></search-field>

    <uib-alert type="danger" close="clearError()" ng-if="error">
      <samp style="white-space: pre;">{{error}}</samp>
    </uib-alert>

    <menubar></menubar>

    <div class="container-fluid" ng-view></div>
  `,

  controller: class {
    constructor($location) {
      this.$location = $location;
    }

    queryChange(newQuery) {
      this.query = newQuery;
    }
  },
};
