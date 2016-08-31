import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import reducers from './reducers';
import SearchField from './components/SearchField.jsx';
import MenuBarContainer from './containers/MenuBarContainer.jsx';
import DashBoardContainer from './containers/DashBoardContainer.jsx';

// Add the reducer to your store on the `routing` key
const store = createStore(reducers);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <SearchField />
      <MenuBarContainer />
      { /* Tell the Router to use our enhanced history */ }
      <Router history={history}>
        <Route path="/">
          <Route path="dashboard" component={DashBoardContainer} />
          <IndexRoute component={DashBoardContainer} />
        </Route>
      </Router>
    </div>
  </Provider>,
  document.getElementById('root')
);
