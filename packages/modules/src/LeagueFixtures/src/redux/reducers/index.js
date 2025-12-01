// @flow

import ExternalAccessSlice, {
  REDUCER_KEY as ExternalAccessSliceKey,
} from '../slices/ExternalAccessSlice';
import AssignStaffSlice, {
  REDUCER_KEY as AssignStaffSliceKey,
} from '../slices/AssignStaffSlice';

const SLICES = {
  [ExternalAccessSliceKey]: ExternalAccessSlice.reducer,
  [AssignStaffSliceKey]: AssignStaffSlice.reducer,
};

export default {
  ...SLICES,
};
