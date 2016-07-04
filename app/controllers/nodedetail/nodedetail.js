export class NodeDetailCtrl {
  constructor($location, $routeParams, $scope, config, puppetDB) {
    this.reset = this.reset.bind(this);
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$scope = $scope;
    this.config = config;
    this.puppetDB = puppetDB;
    this.node = this.$routeParams.node;
    this.reset();
  }

  reset() {
    this.$location.search('page', null);
    this.$scope.numItems = undefined;
    this.fetchFacts();
  }

  // Public: Fetch facts and store them in @facts
  //
  // Returns: `undefined`
  fetchFacts() {
    return this.puppetDB.parseAndQuery(
      'fact-contents',
      null,
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

  // Public: Get the list of important facts to show in detail view
  //
  // Returns: A {Array} of important facts {String}.
  importantFacts() {
    return this.facts.filter((fact) => this.config.get('nodeFacts').indexOf(fact.name) !== -1)
      .sort((a, b) => this.config.get('nodeFacts').indexOf(a.name)
        - this.config.get('nodeFacts').indexOf(b.name));
  }

}
