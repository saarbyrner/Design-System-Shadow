// @flow

import type { Store } from '../types/store';

export const getCurrentId = (state: Store) => state.grid.current_id;
