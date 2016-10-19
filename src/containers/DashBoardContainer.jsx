import React from 'react';

import DashBoard from '../components/DashBoard';

// Takes care of feching nodes and passing it to node list
//
class DashBoardContainer extends React.Component {
  render() {
    return (
      <DashBoard
        serverUrl={this.props.config.serverUrl}
        panels={this.props.config.dashBoardPanels}
      />);
  }
}


DashBoardContainer.propTypes = {
  config: React.PropTypes.object,
};

export default DashBoardContainer;
