// @flow
import { staffProfileApi } from '@kitman/modules/src/StaffProfile/shared/redux/services';
import documentsTabSlice from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';

export default {
  staffProfileApi: staffProfileApi.reducer,
  documentsTabSlice: documentsTabSlice.reducer,
};
