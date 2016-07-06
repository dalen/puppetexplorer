export default {
  bindings: {
    title: '@',
    type: '@',
    query: '@',
  },

  template: `
    <div class="panel" ng-class="'panel-' + $ctrl.type" ng-click="$ctrl.setQuery($ctrl.query)">
      <div class="panel-heading"><h3 class="panel-title">{{$ctrl.title}}</h3></div>
      <div class="panel-body"><span class="lead">
        <span ng-class="$ctrl.count ? '' : 'glyphicon glyphicon-refresh spin'">
          {{$ctrl.count}}
        </span>
      </span></div>
    </div>
  `,

  controller: class {
    constructor(puppetDB) {
      puppetDB.query(
        'nodes',
        ['extract', [['function', 'count']], puppetDB.parse(this.query)],
        {},
        (data) => { this.count = String(data[0].count); },
        (resp) => {
          if (resp.status !== 0) {
            throw new Error(`Could not fetch count of ${this.title} from PuppetDB`);
          }
        }
      );
    }

    // FIXME: move to service or somewhere else?
    setQuery(query) {
      this.$location.search('query', query);
      this.$location.path('/nodes');
    }
  },
};
