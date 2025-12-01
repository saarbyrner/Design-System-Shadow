// @flow
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@kitman/playbook/components';

import { useGetDashboardGroupsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  type RouteParams,
  type Dashboard,
} from '@kitman/modules/src/analysis/LookerDashboardGroup/types';
import { EMPTY_DASHBOARD } from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import LookerEmbed from '@kitman/modules/src/analysis/LookerDashboardGroup/components/LookerEmbed';
import { EmptyDashboardTranslated as EmptyDashboard } from '@kitman/modules/src/analysis/Dashboard/components/EmptyDashboard';

const SingleDashboard = () => {
  const { data } = useGetDashboardGroupsQuery();
  const { dashboards = [] } = data || {};
  const { dashboardId } = useParams<RouteParams>();
  const numericId = Number(dashboardId);

  const selectedDashboard: ?Dashboard = useMemo(
    () => dashboards.find((dashboard) => dashboard?.id === numericId) || null,
    [dashboards, numericId]
  );

  const renderDashboard = () => {
    const lookerDashboardId = selectedDashboard?.looker_dashboard_id;

    return lookerDashboardId ? (
      <LookerEmbed dashboardId={lookerDashboardId} hasTabs={false} />
    ) : (
      <EmptyDashboard customTitle={EMPTY_DASHBOARD} />
    );
  };

  return <Box>{renderDashboard()}</Box>;
};

export default SingleDashboard;
