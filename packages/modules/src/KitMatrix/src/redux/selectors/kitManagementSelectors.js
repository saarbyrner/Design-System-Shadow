// @flow
import { createSelector } from 'reselect';

import type { Store } from '../slice/kitManagementSlice';
import { REDUCER_KEY } from '../slice/kitManagementSlice';

const selectKitManagementState = (state: Store) => state[REDUCER_KEY];

export const selectKitManagementPanel = createSelector(
  selectKitManagementState,
  (kitManagement) => kitManagement?.panel
);

export const selectKitManagementModal = createSelector(
  selectKitManagementState,
  (kitManagement) => kitManagement?.modal
);

export const selectKitManagementSelectedRow = createSelector(
  selectKitManagementState,
  (kitManagement) => kitManagement?.selectedRow
);

export const selectSelectedRows = createSelector(
  selectKitManagementState,
  (kitManagement) => kitManagement?.selectedRows
);

export default {
  selectKitManagementState,
  selectKitManagementPanel,
  selectKitManagementModal,
  selectKitManagementSelectedRow,
  selectSelectedRows,
};
