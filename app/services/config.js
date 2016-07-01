/* global PUPPETDB_SERVERS NODE_FACTS UNRESPONSIVE_HOURS DASHBOARD_PANELS */
export class Config {
  constructor() {
    this.config = new Map();
    this.config.puppetdbServers = PUPPETDB_SERVERS || [['production', '/api']];
    this.config.nodeFacts = NODE_FACTS || [
      'operatingsystem',
      'operatingsystemrelease',
      'manufacturer',
      'productname',
      'processorcount',
      'memorytotal',
      'ipaddress',
    ];
    this.config.unresponsiveHours = UNRESPONSIVE_HOURS || 2;
    this.config.dashboardPanels = DASHBOARD_PANELS || [];
  }

  get(name) {
    return this.config[name];
  }
}
