export const app = {
  template: `
    <search-field on-update="$ctrl.queryChange(query)"></search-field>

    <uib-alert type="danger" close="clearError()" ng-if="error">
      <samp style="white-space: pre;">{{error}}</samp>
    </uib-alert>

    <menubar></menubar>

    <div class="container-fluid" ui-view></div>
  `,

  controller: class {
    queryChange(newQuery) {
      this.query = newQuery;
    }
  },
};
