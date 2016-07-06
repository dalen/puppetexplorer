export default {
  bindings: {
    node: '<',
  },

  template: `
    <div class="panel panel-default" ng-if="$ctrl.facts">
      <div class="panel-heading">Facts</div>
      <table class="table table-striped" ng-if="$ctrl.facts">
        <thead><tr>
          <th>Fact</th>
          <th>Value</th>
        </tr></thead>
        <tbody>
          <tr ng-repeat="fact in $ctrl.importantFacts()">
            <td><span ng-repeat="factCompontent in fact.path track by $index">
              {{factCompontent}}
              <span class="text-muted" ng-if="!$last"> / </span>
            </span></td>
            <td>{{fact.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="button" class="btn btn-default"
      ng-class="{ active: $ctrl.showAllFacts }"
      ng-click="$ctrl.showAllFacts = !$ctrl.showAllFacts">Show all</button>
    <div class="panel panel-default" ng-if="$ctrl.facts && $ctrl.showAllFacts">
      <div class="panel-heading">All facts</div>
      <table class="ui table segment">
        <thead><tr>
          <th>Fact</th>
          <th>Value</th>
        </tr></thead>
        <tbody>
          <tr ng-repeat="fact in $ctrl.facts">
            <td><span ng-repeat="factCompontent in fact.path track by $index">
              {{factCompontent}}
              <span class="text-muted" ng-if="!$last"> / </span>
            </span></td>
            <td>{{fact.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,

  controller: class {
    constructor(config, puppetDB) {
      this.config = config;
      this.puppetDB = puppetDB;

      this.fetchFacts();
    }

    // Fetch facts and store them in this.facts
    fetchFacts() {
      this.puppetDB.query(
        'fact-contents',
        ['=', 'certname', this.node],
        { order_by: JSON.stringify([{ field: 'name', order: 'asc' }]) },
        (data) => {
          this.facts = data.filter(fact => fact.name[0] !== '_').map((fact) => {
            // insert some spaces to break lines
            fact.value = String(fact.value).replace(/(.{25})/g, '\u200B$1');
            return fact;
          });
        }
        );
    }

    // Get the list of important facts to show in detail view
    //
    // Returns: A {Array} of important facts {String}.
    importantFacts() {
      return this.facts.filter((fact) => this.config.get('nodeFacts').indexOf(fact.name) !== -1)
        .sort((a, b) => this.config.get('nodeFacts').indexOf(a.name)
          - this.config.get('nodeFacts').indexOf(b.name));
    }
  },
};
