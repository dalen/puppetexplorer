// @flow
import React from 'react';
import { OrderedSet } from 'immutable';
import { Grid, Row, Col } from 'react-bootstrap';

import FactList from './FactList';
import FactTree from '../classes/FactTree';

// The facts view
export default class Facts extends React.Component {
  props: {
    serverUrl: string,
    factTree: FactTree,
    graphFacts: OrderedSet<factPathElementT[]>,
    toggleGraph: (graph: factPathElementT[]) => void,
  };

  render(): React$Element<*> {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <FactList
              factTree={this.props.factTree}
              graphFacts={this.props.graphFacts}
              toggleGraph={this.props.toggleGraph}
            />
          </Col>
          <Col md={6}>
            {/* <important-facts node="$ctrl.node"></important-facts> */}
          </Col>
        </Row>
      </Grid>
    );
  }
}
