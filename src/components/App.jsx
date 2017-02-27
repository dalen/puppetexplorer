// @flow
import React from 'react';
import { Router, browserHistory as history } from 'react-router';

import SearchField from './SearchField';
import MenuBar from './MenuBar';
import Config from '../Config';
import PuppetDB from '../PuppetDB';

type Props ={
  children: React.Element<*>,
  location: Location,
  router: Router,
};

export default class App extends React.Component {
  static selectTab(id: string) {
    history.push({
      pathname: id,
      search: history.getCurrentLocation().search,
    });
  }

  state: {
    config: mixed,
    queryString: string,
    queryParsed: ?queryT,
  };

  componentWillMount() {
    let queryString;
    if (this.props.location.query.query) {
      queryString = this.props.location.query.query;
    } else {
      queryString = '';
    }
    this.setState({
      config: Config.defaults(),
      queryString,
      queryParsed: PuppetDB.parse(queryString),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location.query.query !== this.props.location.query.query) {
      this.updateQuery(nextProps.location.query.query);
    }
  }

  props: Props;

  updateQuery = (query: string) => {
    this.setState({
      queryString: query,
      queryParsed: PuppetDB.parse(query),
    });
    history.push({
      pathname: history.getCurrentLocation().pathname,
      query: { query },
    });
  }

  render() {
    const child = React.cloneElement(this.props.children, {
      config: this.state.config,
      queryParsed: this.state.queryParsed,
      queryString: this.state.queryString,
      updateQuery: this.updateQuery,
    });

    return (
      <div>
        <SearchField updateQuery={this.updateQuery} queryString={this.state.queryString} />
        <MenuBar selectTab={App.selectTab} router={this.props.router} />
        {child}
      </div>
    );
  }
}
