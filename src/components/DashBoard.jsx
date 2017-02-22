// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import hash from 'object-hash';

import DashBoardMetric from './DashBoardMetric';
import Usage from './Usage';

export default class DashBoard extends React.Component {
  static defaultProps = {
    panels: [],
  };

  static panelWidth(panelRow: Array<*>): number {
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
          {this.props.panels.map(panelRow =>
            <Row key={hash(panelRow)}>
              {panelRow.map(panel =>
                <Col md={DashBoard.panelWidth(panelRow)} key={hash(panel)}>
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
