// @flow
import { useState } from 'react';
import type { SelectOption } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { useSquadScopedPersistentState } from '@kitman/common/src/hooks';
import { Box } from '@kitman/playbook/components';
import { AppHeaderTranslated as AppHeader } from './AppHeader';
import { EventFiltersTranslated as EventFilters } from './EventFilters';
import { MatchdayManagementFiltersTranslated as MatchdayManagementFilters } from '../../../shared/ScheduleFilters/MatchdayManagementFilters';
import { EventsScheduleTranslated as EventsSchedule } from './EventsSchedule';
import { EventsScheduleGridTranslated as EventsScheduleGrid } from './EventsScheduleGrid';
import { getDefaultEventFilters } from '../utils';
import { LastUpdatedDmrTimerTranslated } from './LastUpdatedDmrTimer';

type Props = {
  competitions: Array<SelectOption>,
  teams: Array<SelectOption>,
  turnarounds: Array<Turnaround>,
  seasonMarkerRange: Array<string>,
  isGamesAdmin: boolean,
  canCreateGames: boolean,
  isTrainingSessionsAdmin: boolean,
  canManageWorkload: boolean,
  orgTimezone: string,
  eventConditions: EventConditions,
};

const App = (props: Props) => {
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const isViewMatchDayManagementGameSchedule =
    preferences?.league_game_schedule;

  const [pageView, setPageView] = useState('SCHEDULE');
  const {
    state: eventFilters,
    updateState: setEventFilters,
    resetState: resetEventFilters,
  } = useSquadScopedPersistentState<EventFilters>({
    initialState: getDefaultEventFilters({
      preferences,
      isGameEvents: isViewMatchDayManagementGameSchedule,
    }),
    sessionKey: 'planningHubEventFilters',
  });

  const renderEventsScheduleGrid = () => {
    // this is to preserve old behavior
    const renderMatchDayManagementSchedule =
      permissions?.leagueGame.viewGameSchedule;

    if (renderMatchDayManagementSchedule) {
      return (
        <EventsScheduleGrid
          eventFilters={eventFilters}
          setLastUpdatedAt={setLastUpdatedAt}
        />
      );
    }
    return null;
  };

  const renderMatchdayManagementFilters = () => {
    if (!permissions.leagueGame.viewGameSchedule) return null;
    return (
      <Box>
        <LastUpdatedDmrTimerTranslated lastUpdatedAt={lastUpdatedAt} />
        <MatchdayManagementFilters
          filters={eventFilters}
          setFilters={setEventFilters}
        />
      </Box>
    );
  };

  const renderEventSchedule = () => {
    return isViewMatchDayManagementGameSchedule ? (
      renderEventsScheduleGrid()
    ) : (
      <EventsSchedule
        orgTimezone={props.orgTimezone}
        eventFilters={eventFilters}
      />
    );
  };

  const renderPageView = () => {
    switch (pageView) {
      case 'TIMELINE':
        return 'Timeline view';
      case 'WORKLOAD':
        return 'Workload view';
      case 'SCHEDULE':
      default:
        return renderEventSchedule();
    }
  };

  return (
    <div className="planning">
      <AppHeader
        isGamesAdmin={props.isGamesAdmin}
        canCreateGames={props.canCreateGames}
        isTrainingSessionsAdmin={props.isTrainingSessionsAdmin}
        canManageWorkload={props.canManageWorkload}
        seasonMarkerRange={props.seasonMarkerRange}
        eventConditions={props.eventConditions}
        onEventFiltersChange={resetEventFilters}
        preferences={preferences}
      />
      {isViewMatchDayManagementGameSchedule ? (
        renderMatchdayManagementFilters()
      ) : (
        <EventFilters
          pageView={pageView}
          eventFilters={eventFilters}
          onEventFiltersChange={setEventFilters}
          onPageViewChange={(selectedPageView) => setPageView(selectedPageView)}
          competitions={props.competitions}
          teams={props.teams}
          turnarounds={props.turnarounds}
        />
      )}

      {renderPageView()}
    </div>
  );
};

export default App;
