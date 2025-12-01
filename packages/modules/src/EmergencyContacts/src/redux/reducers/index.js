// @flow
import emergencyContactsSlice, {
  REDUCER_KEY as emergencyContactsKey,
} from './emergencyContactsSlice';
import emergencyContactsAppStatus, {
  REDUCER_KEY as appStatusKey,
} from './appStatus';
import { emergencyContactsApi } from '../services/emergencyContactsApi';

export default {
  [emergencyContactsApi.reducerPath]: emergencyContactsApi.reducer,
  [emergencyContactsKey]: emergencyContactsSlice.reducer,
  [appStatusKey]: emergencyContactsAppStatus,
};
