import update from 'react-addons-update';
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import constants from './constants';
import Config from './Config';
import PuppetDB from './PuppetDB';

const serverReducer = (state = 0, action) => {
  console.log(action); // Temporarily logging all actions

  switch (action.type) {
    case constants.SET_QUERY:
      return update(state, {
        server: { $set: action.server_id },
      });
    default:
      return state;
  }
};

const configReducer = (state = Config.defaults(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const reducers = combineReducers({
  server: serverReducer,
  config: configReducer,
  routing: routerReducer,
});

export default reducers;
