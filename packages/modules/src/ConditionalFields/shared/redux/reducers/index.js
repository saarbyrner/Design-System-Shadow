// @flow
import assigneesSlice from '../slices/assigneesSlice';
import conditionBuildViewSlice from '../slices/conditionBuildViewSlice';
import { conditionalFieldsApi } from '../../services/conditionalFields';

export default {
  assigneesSlice: assigneesSlice.reducer,
  conditionBuildViewSlice: conditionBuildViewSlice.reducer,
  conditionalFieldsApi: conditionalFieldsApi.reducer,
};
