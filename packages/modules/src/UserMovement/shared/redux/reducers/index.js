// @flow
import {
  userMovementApi,
  REDUCER_PATH as userMovementServicesReducerPath,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import userMovementDrawerSlice from '../slices/userMovementDrawerSlice';
import createMovementSlice, {
  REDUCER_KEY as createMovementSliceReducerPath,
} from '../slices/createMovementSlice';
import movementProfileSlice, {
  REDUCER_KEY as movementProfileReducerKey,
} from '../slices/movementProfileSlice';

import movementHistorySlice, {
  REDUCER_KEY as movementHistoryReducerKey,
} from '../slices/movementHistorySlice';

export default {
  [userMovementServicesReducerPath]: userMovementApi.reducer,
  [createMovementSliceReducerPath]: createMovementSlice.reducer,
  [movementHistoryReducerKey]: movementHistorySlice.reducer,
  [movementProfileReducerKey]: movementProfileSlice.reducer,
  userMovementDrawerSlice: userMovementDrawerSlice.reducer,
};
