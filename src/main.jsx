// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import DashBoardContainer from './containers/DashBoardContainer';
import NodeDetailContainer from './containers/NodeDetailContainer';
import NodeListContainer from './containers/NodeListContainer';
import ReportContainer from './containers/ReportContainer';
import EventsContainer from './containers/EventsContainer';
import FactsContainer from './containers/FactsContainer';

const history = browserHistory;

ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="dashboard" component={DashBoardContainer} />
      <Route path="nodes" component={NodeListContainer} />
      <Route path="node/:node" component={NodeDetailContainer} />
      <Route path="report/:reportHash" component={ReportContainer} />
      <Route path="events(/:tab)" component={EventsContainer} />
      <Route path="facts" component={FactsContainer} />
      <IndexRoute component={DashBoardContainer} />
    </Route>
  </Router>,
  document.getElementById('root'),
);
