import React from 'react';
import SearchField from './SearchField';
import MenuBar from './MenuBar';
import Config from '../Config';
import PuppetDB from '../PuppetDB';

class App extends React.Component {
  constructor() {
    super();
    this.updateQuery = this.updateQuery.bind(this);
  }

  componentWillMount() {
    this.state = {
      config: Config.defaults(),
    };

    let queryString;
    if (this.props.location.query &&
        this.props.location.query.query) {
      queryString = this.props.location.query.query;
    } else {
      queryString = '';
    }
    this.updateQuery(queryString);
  }

  updateQuery(query) {
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
        <MenuBar />
        {child}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default App;
