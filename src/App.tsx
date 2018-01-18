import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as qs from 'qs';
import { History, Location } from 'history';

import DashBoard from './modules/dashboard/DashBoard';
import NodeDetail from './modules/node_detail/components/NodeDetail';
import NodeListContainer from './modules/node_list/components/NodeListContainer';
import ReportContainer from './modules/reports/components/ReportContainer';
import EventsContainer from './modules/events/components/EventsContainer';
import FactsContainer from './modules/facts/components/FactsContainer';
import SearchField from './modules/search/components/SearchField';
import MenuBar from './modules/menubar/components/MenuBar';
import * as Config from './Config';
import * as PuppetDB from './PuppetDB';

type Props = {
  readonly location: Location;
  readonly history: History;
};

type State = {
  readonly config: Config.Config;
  readonly search: { readonly [id: string]: any };
  readonly queryParsed: PuppetDB.queryT | null;
};

export default class App extends React.Component<Props, State> {
  static decodeSearch(
    search: string,
  ): {
    readonly search: { readonly [id: string]: any };
    readonly queryParsed: PuppetDB.queryT | null;
  } {
    const parsedSearch = qs.parse(search.slice(1), {
      strictNullHandling: true,
    });
    return {
      search: parsedSearch,
      queryParsed: PuppetDB.parse(parsedSearch.query),
    };
  }

  readonly state = {
    config: Config.defaults(),
    ...App.decodeSearch(this.props.location.search),
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState(App.decodeSearch(nextProps.location.search));
    }
  }

  // Get puppet query
  getQuery(): string {
    return typeof this.state.search.query === 'string'
      ? this.state.search.query
      : '';
  }

  // Update puppet query
  // redirect to node list if we are currently on dashboard
  readonly setQuery = (query: string) => {
    const pathname =
      this.props.location.pathname === '/'
        ? '/nodes'
        : this.props.location.pathname;

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

  readonly selectTab = (id: string) => {
    console.debug('selectTab', this.state);
    this.props.history.push({
      pathname: id,
      search: qs.stringify({
        query: this.state.search.query,
      }),
    });
  };

  // Update search string
  readonly updateSearch = (updates: { readonly [id: string]: any }) => {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: qs.stringify({
        ...this.state.search,
        ...updates,
      }),
    });
  };

  render(): React.ReactNode {
    return (
      <div>
        <SearchField
          updateQuery={this.setQuery}
          queryString={this.getQuery()}
        />
        <MenuBar />

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
              typeof props.match.params.node === 'string' ? (
                <NodeDetail
                  serverUrl={this.state.config.serverUrl}
                  node={props.match.params.node}
                />
              ) : (
                <h1>No node specified</h1>
              )
            }
          />
          <Route
            path="/report/:reportHash"
            render={props =>
              typeof props.match.params.reportHash === 'string' ? (
                <ReportContainer
                  serverUrl={this.state.config.serverUrl}
                  reportHash={props.match.params.reportHash}
                />
              ) : (
                <h1>No report specified</h1>
              )
            }
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
