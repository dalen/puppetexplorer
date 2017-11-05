export type DashBoardPanel = {
  title: string,
  style: 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger',
  bean: string,
  beanValue?: string,
  multiply?: number,
  unit?: string,
  serverUrl?: string,
};

export type Config = {
  serverUrl: string,
  nodeFacts: string[],
  unresponsiveHours: number,
  dashBoardPanels: DashBoardPanel[][],
};

export const defaults = (): Config => {
  return {
    serverUrl: '/api',
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
};
