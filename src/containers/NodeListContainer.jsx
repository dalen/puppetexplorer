// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import NodeList from '../components/NodeList';
import Pagination from '../components/Pagination';

type Props = {
  config: {
    serverUrl: string,
  },
  queryParsed: queryT,
  perPage: number,
};

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
  static defaultProps = {
    perPage: 10,
  };

  state: {
    nodes?: nodeT[],
    count?: number,
    page: number,
  } = {
    page: 1,
  };

  componentDidMount() {
    this.fetchNodes(this.props.config.serverUrl, this.props.queryParsed, this.state.page);
    this.fetchNodeCount(this.props.config.serverUrl, this.props.queryParsed);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.queryParsed !== this.props.queryParsed) {
      this.fetchNodes(nextProps.config.serverUrl, nextProps.queryParsed, this.state.page);
      this.fetchNodeCount(nextProps.config.serverUrl, nextProps.queryParsed);
    }
  }

  props: Props;

  fetchNodes(serverUrl: string, queryParsed: queryT, page: number) {
    PuppetDB.query(serverUrl, 'nodes', {
      query: queryParsed,
      order_by: [{ field: 'certname', order: 'asc' }],
      limit: this.props.perPage,
      offset: (page - 1) * this.props.perPage,
    }).then(data => this.setState({ nodes: data }));
  }

  fetchNodeCount(serverUrl: string, queryParsed: queryT) {
    PuppetDB.query(serverUrl, 'nodes', {
      query: ['extract', [['function', 'count']], queryParsed],
    }).then(data => this.setState({ count: data[0].count }));
  }

  changePage = (page: number) => {
    this.setState({ page, nodes: [] });
    this.fetchNodes(this.props.config.serverUrl, this.props.queryParsed, page);
  }

  render(): React$Element<*> {
    if (this.state && this.state.nodes !== undefined) {
      return (
        <div>
          <NodeList
            total={this.state.count}
            nodes={this.state.nodes}
            serverUrl={this.props.config.serverUrl}
          />
          <Pagination
            count={this.state.count}
            perPage={this.props.perPage}
            activePage={this.state.page}
            onSelect={this.changePage}
          />
        </div>);
    }
    return (<Label>Loading...</Label>);
  }
}
