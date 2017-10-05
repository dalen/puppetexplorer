// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import qs from 'qs';

import { DashBoard } from './modules/dashboard';
import { NodeDetail } from './modules/node_detail';
import { NodeListContainer } from './modules/node_list';
import { ReportContainer } from './modules/reports';
import { EventsContainer } from './modules/events';
import { FactsContainer } from './modules/facts';
import { SearchField } from './modules/search';
import { MenuBar } from './modules/menubar';
import Config from './Config';
import PuppetDB from './PuppetDB';

type Props = {
  location: Location,
  history: RouterHistory,
};

type State = {
  config: {
    serverUrl: string,
    dashBoardPanels: Array<dashBoardPanelT[]>,
  },
  search: { [id: string]: mixed },
  queryParsed: ?queryT,
};

export default class App extends React.Component<Props, State> {
  static decodeSearch(
    search: string,
  ): {
    search: { [id: string]: mixed },
    queryParsed: ?queryT,
  } {
    const parsedSearch = qs.parse(search.slice(1), { strictNullHandling: true });
    return {
      search: parsedSearch,
      queryParsed: PuppetDB.parse(parsedSearch.query),
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      ...App.decodeSearch(props.location.search),
      config: Config.defaults(),
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState(App.decodeSearch(nextProps.location.search));
    }
  }

  // Get puppet query
  getQuery(): string {
    return typeof this.state.search.query === 'string' ? this.state.search.query : '';
  }

  // Update puppet query
  // redirect to node list if we are currently on dashboard
  setQuery = (query: string) => {
    const pathname = this.props.location.pathname === '/' ? '/nodes' : this.props.location.pathname;

    this.props.history.push({
      pathname,
      search: qs.stringify(
        {
          ...this.state.search,
          query,
        },
        { strictNullHandling: true },
      ),
    });
  };

  selectTab = (id: string) => {
    console.debug('selectTab', this.state);
    this.props.history.push({
      pathname: id,
      search: qs.stringify({
        query: this.state.search.query,
      }),
    });
  };

  // Update search string
  updateSearch = (updates: { [id: string]: mixed }) => {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: qs.stringify({
        ...this.state.search,
        ...updates,
      }),
    });
  };

  render() {
    return (
      <div>
        <SearchField updateQuery={this.setQuery} queryString={this.getQuery()} />
        <MenuBar selectTab={this.selectTab} location={this.props.location} />

        <Switch>
          <Route
            path="/nodes"
            render={props => (
              <NodeListContainer
                {...props}
                serverUrl={this.state.config.serverUrl}
                queryParsed={this.state.queryParsed}
              />
            )}
          />
          <Route
            path="/node/:node"
            render={props =>
              (typeof props.match.params.node === 'string' ? (
                <NodeDetail
                  serverUrl={this.state.config.serverUrl}
                  node={props.match.params.node}
                />
              ) : (
                <h1>No node specified</h1>
              ))}
          />
          <Route
            path="/report/:reportHash"
            render={props =>
              (typeof props.match.params.reportHash === 'string' ? (
                <ReportContainer
                  serverUrl={this.state.config.serverUrl}
                  reportHash={props.match.params.reportHash}
                />
              ) : (
                <h1>No report specified</h1>
              ))}
          />
          <Route
            path="/events/:tab?"
            render={props => (
              <EventsContainer
                {...props}
                serverUrl={this.state.config.serverUrl}
                queryParsed={this.state.queryParsed}
                tab={props.match.params.tab}
                updateSearch={this.updateSearch}
                search={this.state.search}
              />
            )}
          />
          <Route
            path="/facts"
            render={props => (
              <FactsContainer
                {...props}
                serverUrl={this.state.config.serverUrl}
                queryParsed={this.state.queryParsed}
                queryString={this.getQuery()}
                updateQuery={this.setQuery}
              />
            )}
          />
          <Route
            render={props => (
              <DashBoard
                {...props}
                panels={this.state.config.dashBoardPanels}
                serverUrl={this.state.config.serverUrl}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}