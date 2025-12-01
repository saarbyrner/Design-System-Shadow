/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import {
  getEventConditions,
  getPermissions,
  getCompetitions,
  getTeams,
} from '@kitman/services';

import App from './src/components/App';

const orgTimezone =
  document.getElementsByTagName('body')[0].dataset.timezone || '';

const PlanningHubApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  useEffect(() => {
    Promise.all([
      getEventConditions(),
      getPermissions(),
      getCompetitions(),
      getTeams(),
      $.get('/ui/turnarounds'),
      $.get('/ui/initial_data_planning_hub'),
    ]).then(
      ([
        eventConditions,
        permissions,
        competitions,
        teams,
        turnarounds,
        planningHubData,
      ]) => {
        setData({
          eventConditions,
          permissions,
          competitions,
          teams,
          turnarounds,
          seasonMarkerRange: planningHubData.season_marker_range,
        });
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  if (requestStatus === 'FAILURE' && hasGlobalFailed) {
    return <AppStatus status="error" isEmbed />;
  }

  if (requestStatus === 'PENDING' && isGlobalLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'SUCCESS' && isGlobalSuccess && data) {
    return (
      <App
        orgTimezone={orgTimezone}
        competitions={defaultMapToOptions(data.competitions)}
        teams={defaultMapToOptions(data.teams)}
        turnarounds={data.turnarounds}
        seasonMarkerRange={data.seasonMarkerRange}
        isGamesAdmin={data.permissions.workloads?.includes('games-admin')}
        canCreateGames={
          data.permissions.workloads?.includes('games-create') ||
          data.permissions.workloads?.includes('games-admin')
        }
        isTrainingSessionsAdmin={data.permissions.workloads?.includes(
          'training-sessions-admin'
        )}
        eventConditions={data.eventConditions}
      />
    );
  }

  return null;
};

export default PlanningHubApp;
