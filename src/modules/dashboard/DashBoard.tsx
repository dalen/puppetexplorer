// @flow
import * as React from 'react';
import { Container, CardDeck } from 'reactstrap';
import * as Config from '../../Config';

import DashBoardMetric from './components/DashBoardMetric';
import Usage from './components/Usage';

export default (props: {
  readonly panels: ReadonlyArray<ReadonlyArray<Config.DashBoardPanel>>;
  readonly serverUrl: string;
}) => (
  <div>
    <Container className="my-1">
      {props.panels.map(panelRow => (
        <CardDeck>
          {panelRow.map(panel => (
            <DashBoardMetric serverUrl={props.serverUrl} {...panel} />
          ))}
        </CardDeck>
      ))}
    </Container>
    <Usage />
  </div>
);
