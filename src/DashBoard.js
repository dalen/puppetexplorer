import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import DashBoardMetric from './DashBoardMetric';
import Usage from './Usage';
import PuppetDB from './PuppetDB';

class DashBoard extends React.Component {
  panelWidth(panelRow) {
    return Math.max(2, Math.floor(12 / panelRow.length));
  }

  render() {
    return (
      <div>
        <Grid>
          {this.props.route.panels.map((panelRow, i) =>
            <Row key={i}>
              {panelRow.map((panel, j) =>
                <Col key={j} md={this.panelWidth(panelRow)}>
                  <DashBoardMetric {...panel} />
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
  route: React.PropTypes.object.isRequired,
  // panels: React.PropTypes.array,
};

// DashBoard.defaultProps = {
//  panels: [],
// };

export default DashBoard;
