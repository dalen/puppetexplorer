// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DashBoardMetric from './DashBoardMetric';
import Usage from './Usage';

import type { dashBoardPanelT } from '../types';

export default class DashBoard extends React.Component {
  static defaultProps = {
    panels: [],
  };

  static panelWidth(panelRow) {
    return Math.max(2, Math.floor(12 / panelRow.length));
  }

  props: {
    panels: Array<dashBoardPanelT[]>,
    serverUrl: string,
  };

  render() {
    return (
      <div>
        <Grid>
          {this.props.panels.map((panelRow, i) =>
            <Row key={i}>
              {panelRow.map((panel, j) =>
                <Col key={j} md={DashBoard.panelWidth(panelRow)}>
                  <DashBoardMetric serverUrl={this.props.serverUrl} {...panel} />
                </Col>,
              )}
            </Row>,
          )}
        </Grid>
        <Usage />
      </div>
    );
  }
}
