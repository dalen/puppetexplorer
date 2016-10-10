import { browserHistory as history } from 'react-router';
import constants from '../constants';

export const setServer = (n) => {
  history.push({ search: '?server=n' });

  return {
    type: constants.SET_SERVER,
    id: n,
  };
};
