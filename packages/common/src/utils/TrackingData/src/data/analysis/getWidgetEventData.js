// @flow
import type {
  WidgetCacheRefreshData,
  WidgetCacheRefreshParams,
} from '@kitman/common/src/utils/TrackingData/src/types/analysis';

export const getWidgetCacheRefreshData = ({
  dashboardId,
  widgetId,
}: WidgetCacheRefreshParams): WidgetCacheRefreshData => {
  return {
    DashboardId: dashboardId,
    WidgetId: widgetId,
  };
};
