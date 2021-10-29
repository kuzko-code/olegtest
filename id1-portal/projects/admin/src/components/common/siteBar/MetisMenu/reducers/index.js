/* eslint-env browser */

import { combineReducers } from 'redux';
import content from './content';
import emitters from './emitters';

export default combineReducers({
  content,
  emitters,
});
