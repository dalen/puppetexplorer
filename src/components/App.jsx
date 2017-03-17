// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import queryString from 'query-string';

import DashBoardContainer from '../containers/DashBoardContainer';
import NodeDetailContainer from '../containers/NodeDetailContainer';
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

class App extends React.Component {
  state: {
    config: object,
    puppetQueryString: string,
    queryParsed: ?queryT,
  };

  componentWillMount() {
    console.log('App.componentWillMount', this.props);
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
    console.log('selectTab', )
    this.props.history.push({
      pathname: id,
      search: this.props.location.search,
    });
  }

  updateQuery = (query: string) => {
    this.setState({
      puppetQueryString: query,
      queryParsed: PuppetDB.parse(query),
    });
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: { query },
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
              queryParsed={this.state.queryParsed}
              config={this.state.config}
            />)}
          />
          <Route path="/node/:node" component={NodeDetailContainer} />
          <Route path="/report/:reportHash" component={ReportContainer} />
          <Route path="/events(/:tab)" component={EventsContainer} />
          <Route path="/facts" component={FactsContainer} />
          <Route
            render={props => (<DashBoardContainer
              {...props}
              config={this.state.config}
            />)}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
