export type DashBoardPanel = {
  readonly title: string;
  readonly style:
    | 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger';
  readonly bean: string;
  readonly beanValue?: string;
  readonly multiply?: number;
  readonly unit?: string;
  readonly serverUrl?: string;
};

export type Config = {
  readonly serverUrl: string;
  readonly nodeFacts: string[];
  readonly unresponsiveHours: number;
  readonly dashBoardPanels: DashBoardPanel[][];
};

export const defaults = (): Config => {
  return {
    serverUrl: 'http://localhost:8080/',
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
