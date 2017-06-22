// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import Pagination from './Pagination';

type Props = {
  serverUrl: string,
  perPage: number,
  listQuery: ?queryT,
  countQuery: queryT,
};

export default (
  ListElement: ReactClass<*>,
  endpoint: string,
  itemsProp: string,
  orderBy: {[id: string]: string}[] = [{ field: 'certname', order: 'asc' }],
) =>
  class PaginatedList extends React.Component {
    static defaultProps = {
      perPage: 25,
    };

    state: {
      items?: mixed,
      count?: number,
      page: number,
    } = {
      page: 1,
    };

    componentDidMount() {
      this.fetchItems(this.props.serverUrl, this.props.listQuery, this.state.page);
      this.fetchCount(this.props.serverUrl, this.props.countQuery);
    }

    componentWillReceiveProps(nextProps: Props) {
      const page = (nextProps.listQuery !== this.props.listQuery) ?
        1
      :
        this.state.page;

      // Reset pagination if query changes
      if (nextProps.listQuery !== this.props.listQuery) {
        this.setState({ page });
      }

      if (nextProps.serverUrl !== this.props.serverUrl ||
        nextProps.listQuery !== this.props.listQuery) {
        this.fetchItems(nextProps.serverUrl, nextProps.listQuery, page);
      }
      if (nextProps.serverUrl !== this.props.serverUrl ||
        nextProps.countQuery !== this.props.countQuery) {
        this.fetchCount(nextProps.serverUrl, nextProps.countQuery);
      }
    }

    props: Props;

    fetchItems(serverUrl: string, query: ?queryT, page: number) {
      PuppetDB.query(serverUrl, endpoint, {
        query,
        order_by: orderBy,
        limit: this.props.perPage,
        offset: (page - 1) * this.props.perPage,
      }).then(data => this.setState({ items: data }));
    }

    fetchCount(serverUrl: string, query: queryT) {
      PuppetDB.query(serverUrl, endpoint, {
        query,
      }).then(data => this.setState({ count: data[0].count }));
    }

    changePage = (page: number) => {
      this.setState({ page });
      this.fetchItems(this.props.serverUrl, this.props.listQuery, page);
    }

    render() {
      if (this.state.items !== undefined) {
        const props = { [itemsProp]: this.state.items };
        return (
          <div>
            <ListElement
              total={this.state.count}
              serverUrl={this.props.serverUrl}
              {...props}
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
  };
