import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import reducers from './reducers';
import App from './components/App';
import DashBoardContainer from './containers/DashBoardContainer';
import NodeList from './components/NodeList';

// Add the reducer to your store on the `routing` key
const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>

    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="dashboard" component={DashBoardContainer} />
        <Route path="nodes" component={NodeList} />
        <IndexRoute component={DashBoardContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
