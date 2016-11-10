// @flow
import React from 'react';
import { browserHistory as history } from 'react-router';

import SearchField from './SearchField';
import MenuBar from './MenuBar';
import Config from '../Config';
import PuppetDB from '../PuppetDB';
import type { queryT } from '../types';

export default class App extends React.Component {
  static selectTab(id: string) {
    history.push(id);
  }

  state: {
    config: mixed,
    queryString: string,
    queryParsed: ?queryT,
  };

  componentWillMount() {
    let queryString;
    if (this.props.location.query &&
        this.props.location.query.query &&
        this.props.location.query.query instanceof String
      ) {
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

  props: {
    children: React.Element<*>,
    location: Location,
  };

  updateQuery = (query: string) => {
    this.setState({
      queryString: query,
      queryParsed: PuppetDB.parse(query),
    });
  }

  render() {
    const child = React.cloneElement(this.props.children, {
      config: this.state.config,
      queryParsed: this.state.queryParsed,
    });

    return (
      <div>
        <SearchField updateQuery={this.updateQuery} queryString={this.state.queryString} />
        <MenuBar selectTab={App.selectTab} />
        {child}
      </div>
    );
  }
}
