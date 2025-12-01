// @flow
import type {
  DashboardCacheRefreshData,
  DashboardCacheRefreshParams,
} from '@kitman/common/src/utils/TrackingData/src/types/analysis';

export const getDashboardCacheRefreshData = ({
  dashboardId,
}: DashboardCacheRefreshParams): DashboardCacheRefreshData => {
  return {
    DashboardId: dashboardId,
  };
};
