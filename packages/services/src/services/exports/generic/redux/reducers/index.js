// @flow
import { genericExportsApi } from '@kitman/services/src/services/exports/generic';
import genericExportsSlice from '@kitman/services/src/services/exports/generic/redux/slices/genericExportsSlice';

export default {
  genericExportsApi: genericExportsApi.reducer,
  genericExportsSlice: genericExportsSlice.reducer,
};
