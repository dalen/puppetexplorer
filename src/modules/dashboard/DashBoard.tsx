// @flow
import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as hash from 'object-hash';
import * as Config from '../../Config';

import DashBoardMetric from './components/DashBoardMetric';
import Usage from './components/Usage';

const panelWidth = (panelRow: any[]): number => Math.max(2, Math.floor(12 / panelRow.length));

export default (props: { panels: Config.DashBoardPanel[][], serverUrl: string }) =>
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
