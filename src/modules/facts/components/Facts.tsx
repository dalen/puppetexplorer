import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactList from './FactList';
import FactChart from './FactChart';
import FactTree from '../FactTree';
import * as PuppetDB from '../../../PuppetDB';

// The facts view
export default (props: {
  serverUrl: string,
  queryParsed: PuppetDB.queryT | null,
  factTree: FactTree,
  activeFactCharts: OrderedSet<PuppetDB.factPathT>,
  toggleChart: (chart: PuppetDB.factPathT) => void,
  factSelect: (fact: PuppetDB.factPathT, value: string) => void,
}) =>
  (<Grid>
    <Row>
      <Col md={6}>
        <FactList
          factTree={props.factTree}
          activeFactCharts={props.activeFactCharts}
          toggleChart={props.toggleChart}
        />
      </Col>
      <Col md={6}>
        {props.activeFactCharts.map(fact =>
          (<FactChart
            fact={fact}
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
            key={fact.join('.')}
            onSelect={value => props.factSelect(fact, value)}
          />),
        )}
      </Col>
    </Row>
  </Grid>);
