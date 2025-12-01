// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DashboardGroupResponse } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';

const getDashboardGroups = async (): Promise<DashboardGroupResponse> => {
  const { data } = await axios.get('/ui/reporting/dashboard_groups/list');

  return data;
};

export default getDashboardGroups;
