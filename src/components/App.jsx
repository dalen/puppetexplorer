import React from 'react';
import SearchField from './SearchField';
import MenuBar from './MenuBar';
import Config from '../Config';
import PuppetDB from '../PuppetDB';

class App extends React.Component {
  constructor() {
    super();
    let query;
    let queryParsed;
    if (this.props &&
        this.props.location &&
        this.props.location.query &&
        this.props.location.query.query) {
      query = this.props.location.query.query;
      queryParsed = PuppetDB.parse(query);
    } else {
      query = '';
      queryParsed = null;
    }
    this.state = {
      config: Config.defaults(),
      query,
      queryParsed,
    };
  }

  render() {
    const child = React.cloneElement(this.props.children, {
      config: this.state.config,
      query: this.state.query,
      queryString: this.state.queryString,
    });

    return (
      <div>
        <SearchField updateQuery={alert} />
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
