import React from 'react';
import { Router, Route, IndexRoute, hashHistory as history } from 'react-router';
import SearchField from './SearchField.jsx';
import MenuBar from './MenuBar.jsx';
import DashBoard from './DashBoard.jsx';
import Config from './Config';
import PuppetDB from './PuppetDB';

export default class PuppetExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { serverUrl: Config.get('servers')[0].url };
  }

  setServer(serverName) {
    this.setState({ serverUrl: PuppetDB.serverUrl(serverName, Config.get('servers')) });
  }

  render() {
    return (
      <div>
        <SearchField />
        <MenuBar servers={Config.get('servers')} serverSelect={this.setServer.bind(this)} />
        <Router history={history}>
          <Route path="/">
            <Route
              path="dashboard"
              component={DashBoard}
              panels={Config.get('dashBoardPanels')}
              serverUrl={this.state.serverUrl}
            />
            <IndexRoute component={DashBoard} panels={Config.get('dashBoardPanels')} />
          </Route>
        </Router>
      </div>
    );
  }
}
