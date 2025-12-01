// @flow
import _get from 'lodash/get';
import type { Store } from '../types/store';

export const getTurnaroundList = (state: Store) =>
  _get(state, 'turnaroundList');
