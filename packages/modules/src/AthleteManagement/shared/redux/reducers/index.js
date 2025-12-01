// @flow
import athleteManagementSlice from '../slices/athleteManagementSlice';
import { athleteManagementApi } from '../services';

export default {
  athleteManagementSlice: athleteManagementSlice.reducer,
  athleteManagementApi: athleteManagementApi.reducer,
};
