// @flow
import React from 'react';

import DashBoard from '../components/DashBoard';

// Takes care of passing the panels configuration to DashBoard
//
export default class DashBoardContainer extends React.Component {
  props: {
    config: {
      serverUrl: string,
      dashBoardPanels: dashBoardPanelT[],
    },
  };

  render(): React$Element<*> {
    return (
      <DashBoard
        serverUrl={this.props.config.serverUrl}
        panels={this.props.config.dashBoardPanels}
      />);
  }
}
