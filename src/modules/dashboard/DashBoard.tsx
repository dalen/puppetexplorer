// @flow
import * as React from 'react';
import * as Grid from 'react-bootstrap/lib/Grid';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as hash from 'object-hash';
import * as Config from '../../Config';

import DashBoardMetric from './components/DashBoardMetric';
import Usage from './components/Usage';

const panelWidth = (panelRow: ReadonlyArray<any>): number =>
  Math.max(2, Math.floor(12 / panelRow.length));

export default (props: {
  readonly panels: ReadonlyArray<ReadonlyArray<Config.DashBoardPanel>>;
  readonly serverUrl: string;
}) => (
  <div>
    <Grid>
      {props.panels.map(panelRow => (
        <Row key={hash(panelRow)}>
          {panelRow.map(panel => (
            <Col md={panelWidth(panelRow)} key={hash(panel)}>
              <DashBoardMetric serverUrl={props.serverUrl} {...panel} />
            </Col>
          ))}
        </Row>
      ))}
    </Grid>
    <Usage />
  </div>
);
