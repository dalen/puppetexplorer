// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import queryString from 'query-string';

import DashBoard from './DashBoard';
import NodeDetail from './NodeDetail';
import NodeListContainer from '../containers/NodeListContainer';
import ReportContainer from '../containers/ReportContainer';
import EventsContainer from '../containers/EventsContainer';
import FactsContainer from '../containers/FactsContainer';
import SearchField from './SearchField';
import MenuBar from './MenuBar';
import Config from '../Config';
import PuppetDB from '../PuppetDB';

type Props = {
  location: Location,
  history: RouterHistory,
};

export default class App extends React.Component {
  state: {
    config: {
      serverUrl: string,
      dashBoardPanels: Array<dashBoardPanelT[]>,
    },
    puppetQueryString: string,
    queryParsed: ?queryT,
  };

  componentWillMount() {
    const puppetQueryString = queryString.parse(this.props.location.search).query || '';
    this.setState({
      config: Config.defaults(),
      puppetQueryString,
      queryParsed: PuppetDB.parse(puppetQueryString),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (queryString.parse(nextProps.location.search).query !==
      queryString.parse(this.props.location.search).query) {
      this.updateQuery(queryString.parse(nextProps.location.search).query);
    }
  }

  props: Props;

  selectTab = (id: string) => {
    this.props.history.push({
      pathname: id,
      search: queryString.stringify({
        query: queryString.parse(this.props.location.search).query,
      }),
    });
  }

  // Update the puppet query
  updateQuery = (query: string) => {
    this.setState({
      puppetQueryString: query,
      queryParsed: PuppetDB.parse(query),
    });
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify({
        ...queryString.parse(this.props.location.search),
        query,
      }),
    });
  }

  render() {
    return (
      <div>
        <SearchField updateQuery={this.updateQuery} queryString={this.state.puppetQueryString} />
        <MenuBar selectTab={this.selectTab} location={this.props.location} />

        <Switch>
          <Route
            path="/nodes"
            render={props => (<NodeListContainer
              {...props}
              serverUrl={this.state.config.serverUrl}
              queryParsed={this.state.queryParsed}
            />)}
          />
          <Route
            path="/node/:node"
            render={props => (<NodeDetail
              serverUrl={this.state.config.serverUrl}
              node={props.match.params.node}
            />)}
          />
          <Route
            path="/report/:reportHash"
            render={props => (<ReportContainer
              serverUrl={this.state.config.serverUrl}
              reportHash={props.match.params.reportHash}
            />)}
          />
          <Route
            path="/events/:tab?"
            render={props => (<EventsContainer
              {...props}
              serverUrl={this.state.config.serverUrl}
              queryParsed={this.state.queryParsed}
              tab={props.match.params.tab}
            />)}
          />
          <Route
            path="/facts"
            render={props => (<FactsContainer
              {...props}
              serverUrl={this.state.config.serverUrl}
              queryParsed={this.state.queryParsed}
              queryString={this.state.puppetQueryString}
              updateQuery={this.updateQuery}
            />)}
          />
          <Route
            render={props => (<DashBoard
              {...props}
              panels={this.state.config.dashBoardPanels}
              serverUrl={this.state.config.serverUrl}
            />)}
          />
        </Switch>
      </div>
    );
  }
}
