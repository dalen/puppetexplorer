import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import DashBoardContainer from './containers/DashBoardContainer';
import NodeList from './components/NodeList';

const history = browserHistory;

ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="dashboard" component={DashBoardContainer} />
      <Route path="nodes" component={NodeList} />
      <IndexRoute component={DashBoardContainer} />
    </Route>
  </Router>,
  document.getElementById('root')
);
