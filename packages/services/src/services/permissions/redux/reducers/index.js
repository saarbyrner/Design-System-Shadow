// @flow
import { permissionsDetailsApi } from '@kitman/services/src/services/permissions';
import permissionsDetailsSlice from '@kitman/services/src/services/permissions/redux/slices/permissionsDetailsSlice';

export default {
  permissionsDetailsApi: permissionsDetailsApi.reducer,
  permissionsDetailsSlice: permissionsDetailsSlice.reducer,
};
