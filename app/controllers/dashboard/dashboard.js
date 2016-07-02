/* global DASHBOARD_PANELS */
export class DashboardCtrl {
  constructor(puppetDB, config) {
    this.puppetDB = puppetDB;

    this.panels = config.get('dashboardPanels');
    this.panelWidth = Math.max(2, Math.floor(12 / this.panels.length));
    this.checkVersion();
  }

  checkVersion() {
    this.puppetDB.getVersion().then(
      (resp) => {
        this.major = parseInt(resp.data.version.split('.')[0], 10);
        this.minor = parseInt(resp.data.version.split('.')[1], 10);
        this.patch = parseInt(resp.data.version.split('.')[2], 10);
        if (this.major < 4 || (this.major === 3 && this.minor < 2)) {
          throw new Error('This version of Puppet Explorer requires puppetDB version 3.2.0+' +
            `, you are running puppetDB ${resp.data.version}`);
        }
      }
    );
  }
}
