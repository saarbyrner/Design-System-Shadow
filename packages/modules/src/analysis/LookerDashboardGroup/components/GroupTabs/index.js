// @flow
import { useMemo } from 'react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import colors from '@kitman/common/src/variables/colors';

import { Box, Tabs, Tab } from '@kitman/playbook/components';
import { BASE_URL } from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import type { Dashboard } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';

const styles = {
  container: {
    borderBottom: `1px solid ${colors.s13}`,
    padding: '20px 20px 0 20px',
    backgroundColor: colors.white,
  },
  tab: {
    color: colors.grey_100,
  },
};

type Props = {
  dashboardId: number,
  slug: string,
  dashboards: Array<Dashboard>,
};

const GroupTabs = ({ dashboardId, slug, dashboards }: Props) => {
  const locationAssign = useLocationAssign();

  const handleChange = (event, id) => {
    const url = `${BASE_URL}/${slug}/${id}`;

    locationAssign(url);
  };

  const tabs = useMemo(
    () =>
      dashboards.map((dashboard) => ({
        label: dashboard.name,
        id: dashboard.id,
      })),
    [dashboardId, slug]
  );

  return (
    <Box sx={styles.container}>
      <Tabs
        value={dashboardId}
        onChange={handleChange}
        aria-label="Dashboard group tabs"
      >
        {tabs.map((tab) => (
          <Tab label={tab.label} value={tab.id} key={tab.id} sx={styles.tab} />
        ))}
      </Tabs>
    </Box>
  );
};

export default GroupTabs;
