// @flow
import React from 'react';

import DashBoard from '../components/DashBoard';

// Takes care of passing the panels configuration to DashBoard
//
export default class DashBoardContainer extends React.Component {

  render(): React$Element<*> {
    return (
      <DashBoard
        serverUrl={this.props.config.serverUrl}
        panels={this.props.config.dashBoardPanels}
      />);
  }
}


DashBoardContainer.propTypes = {
  config: React.PropTypes.shape({
    serverUrl: React.PropTypes.string,
    dashBoardPanels: React.PropTypes.array,
  }),
};
