// @flow
import { STATUS } from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';

export type Dashboard = {
  id: number,
  looker_dashboard_id: number,
  name: string,
};

export type DashboardGroup = {
  id: number,
  slug: string,
  name: string,
  description: string,
  dashboards: Array<Dashboard>,
};

export type DashboardGroupResponse = {
  dashboard_groups: Array<DashboardGroup>,
  dashboards: Array<Dashboard>,
};

export type RouteParams = {
  dashboardGroupSlug: string,
  dashboardId: string,
};

export type StatusType = $Values<typeof STATUS>;
