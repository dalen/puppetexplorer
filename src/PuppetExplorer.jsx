import React from 'react';

export default class PuppetExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.setServer = this.setServer.bind(this);
    this.state = { serverUrl: Config.get('servers')[0].url };
  }

  setServer(serverName) {
    this.setState({ serverUrl: PuppetDB.serverUrl(serverName, Config.get('servers')) });
  }

  render() {
    return (
    );
  }
}
