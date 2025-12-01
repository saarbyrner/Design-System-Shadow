// @flow
import { templateDashboardsApi } from '../services/templateDashboards';
import filtersMiddleware from './filters';

export default [...filtersMiddleware, templateDashboardsApi.middleware];
