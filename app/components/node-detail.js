export const nodeDetail = {
  template: `
    <div class="page-header">
      <h3>{{$ctrl.node}}</h3>
    </div>
    <div class="row">
      <div class="col-md-6">
        <report-list node="$ctrl.node"></report-list>
      </div>
      <div class="col-md-6">
        <important-facts node="$ctrl.node"></important-facts>
      </div>
    </div>
  `,

  controller: class {
    constructor($stateParams) {
      this.node = $stateParams.node;
    }
  },
};
