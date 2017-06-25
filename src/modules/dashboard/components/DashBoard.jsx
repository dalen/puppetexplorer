// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import hash from 'object-hash';

import DashBoardMetric from './DashBoardMetric';
import Usage from './Usage';

const panelWidth = (panelRow: Array<*>): number => Math.max(2, Math.floor(12 / panelRow.length));

export default (props: { panels: Array<dashBoardPanelT[]>, serverUrl: string }) =>
  (<div>
    <Grid>
      {props.panels.map(panelRow =>
        (<Row key={hash(panelRow)}>
          {panelRow.map(panel =>
            (<Col md={panelWidth(panelRow)} key={hash(panel)}>
              <DashBoardMetric serverUrl={props.serverUrl} {...panel} />
            </Col>),
          )}
        </Row>),
      )}
    </Grid>
    <Usage />
  </div>);
