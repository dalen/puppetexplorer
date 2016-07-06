export default {
  template: `
    <search-field on-update="$ctrl.queryChange(query)"></search-field>

    <uib-alert type="danger" close="clearError()" ng-if="error">
      <samp style="white-space: pre;">{{error}}</samp>
    </uib-alert>

    <menubar></menubar>

    <div class="container-fluid" ui-view></div>
  `,

  controller: class {
    constructor($state) {
      this.$state = $state;
    }

    // FIXME: not needed
    queryChange(newQuery) {
      this.query = newQuery;
      // this.$state.params.query = newQuery;
    }
  },
};
