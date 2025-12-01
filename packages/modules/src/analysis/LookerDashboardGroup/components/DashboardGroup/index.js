// @flow
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@kitman/playbook/components';

import { useGetDashboardGroupsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  type RouteParams,
  type Dashboard,
} from '@kitman/modules/src/analysis/LookerDashboardGroup/types';
import GroupTabs from '@kitman/modules/src/analysis/LookerDashboardGroup/components/GroupTabs';
import {
  EMPTY_GROUP,
  EMPTY_DASHBOARD,
} from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import LookerEmbed from '@kitman/modules/src/analysis/LookerDashboardGroup/components/LookerEmbed';
import { EmptyDashboardTranslated as EmptyDashboard } from '@kitman/modules/src/analysis/Dashboard/components/EmptyDashboard';

const DashboardGroup = () => {
  const { data } = useGetDashboardGroupsQuery();
  const { dashboard_groups: dashboardGroups = [] } = data || {};

  const { dashboardGroupSlug, dashboardId } = useParams<RouteParams>();
  const numericId = Number(dashboardId);

  const selectedGroup = useMemo(
    () =>
      dashboardGroups.find((group) => group?.slug === dashboardGroupSlug) ||
      EMPTY_GROUP,
    [dashboardGroups, dashboardGroupSlug]
  );

  const selectedDashboard: ?Dashboard = useMemo(
    () =>
      selectedGroup.dashboards.find(
        (dashboard) => dashboard?.id === numericId
      ) || null,
    [selectedGroup, numericId]
  );

  const enableTabs = selectedGroup.dashboards.length > 1;
  const lookerDashboardId = selectedDashboard?.looker_dashboard_id;

  const renderDashboard = () => {
    return lookerDashboardId ? (
      <LookerEmbed dashboardId={lookerDashboardId} hasTabs={enableTabs} />
    ) : (
      <EmptyDashboard customTitle={EMPTY_DASHBOARD} />
    );
  };

  return (
    <Box>
      {enableTabs && (
        <GroupTabs
          dashboardId={numericId}
          slug={dashboardGroupSlug}
          dashboards={selectedGroup.dashboards}
        />
      )}
      {renderDashboard()}
    </Box>
  );
};

export default DashboardGroup;
