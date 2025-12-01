// @flow
import { useState, useEffect, useCallback, useRef } from 'react';
import { getEmbedSDK } from '@looker/embed-sdk';
import { Box } from '@kitman/playbook/components';
import { STATUS } from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import DashboardStatus from '@kitman/modules/src/analysis/LookerDashboardGroup/components/DashboardStatus';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  dashboard: (hasTabs?: boolean) => ({
    iframe: {
      width: '100%',
      // Subtract header height (+ tabs if present) from viewport
      height: `calc(100vh - ${hasTabs ? 128 : 60}px)`,
      border: 'none',
    },
  }),
};

type Props = {
  dashboardId: number,
  hasTabs: boolean,
};

const LookerEmbed = ({ dashboardId, hasTabs }: Props) => {
  const [dashboardStatus, setDashboardStatus] = useState(STATUS.LOADING);

  const lookerConnectionRef = useRef(null);

  const setupDashboard = useCallback((div) => {
    if (!div || lookerConnectionRef.current) {
      return;
    }

    getEmbedSDK()
      .createDashboardWithId(dashboardId)
      .withAllowAttr('fullscreen')
      .appendTo(div)
      .on('dashboard:loaded', () => setDashboardStatus(STATUS.DONE))
      .build()
      .connect()
      .then((connection) => {
        lookerConnectionRef.current = connection;
      })
      .catch(() => {
        setDashboardStatus(STATUS.CONNECTION_ERROR);
      });
  }, []);

  useEffect(() => {
    const connection = lookerConnectionRef.current;
    if (connection && dashboardId) {
      // Load a different dashboard into the existing iframe
      const stringId = dashboardId.toString();
      connection.loadDashboard(stringId).catch(() => {
        setDashboardStatus(STATUS.ERROR_LOADING_DASHBOARD);
      });
    }
  }, [dashboardId]);

  return (
    <Box sx={styles.container}>
      <DashboardStatus status={dashboardStatus} />
      <div
        id="embed-dashboard"
        ref={setupDashboard}
        css={styles.dashboard(hasTabs)}
      />
    </Box>
  );
};

export default LookerEmbed;
