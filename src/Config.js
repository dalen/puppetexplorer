export default class Config {
  static defaults() {
    return {
      servers: [
        {
          name: 'production',
          url: '/api',
        },
        {
          name: 'testing',
          url: '/api',
        },
      ],
      nodeFacts: [
        'operatingsystem',
        'operatingsystemrelease',
        'manufacturer',
        'productname',
        'processorcount',
        'memorytotal',
        'ipaddress',
      ],
      unresponsiveHours: 2,
      dashBoardPanels: [
        [
          {
            title: 'Nodes',
            style: 'primary',
            bean: 'puppetlabs.puppetdb.population:name=num-nodes',
          },
          {
            title: 'Resources',
            style: 'primary',
            bean: 'puppetlabs.puppetdb.population:name=num-resources',
          },
          {
            title: 'Avg Resources/Node',
            style: 'primary',
            bean: 'puppetlabs.puppetdb.population:name=avg-resources-per-node',
          },
          {
            title: 'Resource Duplication',
            style: 'primary',
            bean: 'puppetlabs.puppetdb.population:name=pct-resource-dupes',
            multiply: 100,
            unit: '%',
          },
        ],
      ],
    };
  }

  static get(name) {
    return this.defaults()[name];
  }
}
