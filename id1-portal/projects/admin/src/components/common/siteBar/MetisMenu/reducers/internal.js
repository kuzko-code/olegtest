/* eslint-env browser */

import { combineReducers } from 'redux';
import reducers from './index';

export default combineReducers({
  metisMenuStore: reducers,
});
