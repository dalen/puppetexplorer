import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DashBoardMetric from './DashBoardMetric';
import Usage from './Usage';

class DashBoard extends React.Component {
  panelWidth(panelRow) {
    return Math.max(2, Math.floor(12 / panelRow.length));
  }

  render() {
    return (
      <div>
        <Grid>
          {this.props.panels.map((panelRow, i) =>
            <Row key={i}>
              {panelRow.map((panel, j) =>
                <Col key={j} md={this.panelWidth(panelRow)}>
                  <DashBoardMetric serverUrl={this.props.serverUrl} {...panel} />
                </Col>
              )}
            </Row>
          )}
        </Grid>
        <Usage />
      </div>
    );
  }
}

DashBoard.propTypes = {
  panels: React.PropTypes.array,
  serverUrl: React.PropTypes.string.isRequired,
};

DashBoard.defaultProps = {
  panels: [],
};

export default DashBoard;
