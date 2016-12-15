// @flow
import React from 'react';
import { OrderedSet } from 'immutable';
import { Grid, Row, Col } from 'react-bootstrap';

import FactList from './FactList';
import FactChart from './FactChart';
import FactTree from '../classes/FactTree';

// The facts view
export default class Facts extends React.Component {
  props: {
    serverUrl: string,
    queryParsed: queryT,
    factTree: FactTree,
    activeFactCharts: OrderedSet<factPathElementT[]>,
    toggleChart: (graph: factPathElementT[]) => void,
  };

  render(): React$Element<*> {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <FactList
              factTree={this.props.factTree}
              activeFactCharts={this.props.activeFactCharts}
              toggleChart={this.props.toggleChart}
            />
          </Col>
          <Col md={6}>
            {this.props.activeFactCharts.map((fact) =>
              {
                console.log(fact);
              return (<FactChart
                fact={fact.toJS()}
                serverUrl={this.props.serverUrl}
                queryParsed={this.props.queryParsed}
                key={fact.join('.')}
              />); }) }
          </Col>
        </Row>
      </Grid>
    );
  }
}
