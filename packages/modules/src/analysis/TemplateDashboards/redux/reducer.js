// @flow
import { templateDashboardsApi } from './services/templateDashboards';
import filtersReducer, {
  REDUCER_KEY as templateDashboardsReducerKey,
} from './slices/filters';

export default {
  templateDashboardsApi: templateDashboardsApi.reducer,
  [templateDashboardsReducerKey]: filtersReducer,
};
