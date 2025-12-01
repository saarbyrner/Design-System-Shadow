// @flow
import { useEffect, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import {
  getLeagueScheduleHeaders,
  getStatusHeader,
  LeagueScheduleActionsHeader,
  MatchDayScheduleHeaders,
  MatchDayStatusHeader,
  MatchDayActionsHeader,
  getLockStatusHeader,
  getAccessStatusHeader,
  getScoutAccessActionsHeader,
  getScoutAttendeesHeader,
} from '@kitman/modules/src/shared/FixtureScheduleView/grid/headerConfig';
import { type Game } from '@kitman/common/src/types/Event';
import { type EventFilters } from '@kitman/modules/src/PlanningHub/types';
import {
  getLeagueScheduleRowData,
  getMatchDayScheduleRowData,
  getScoutAccessManagementRowData,
} from '@kitman/modules/src/shared/FixtureScheduleView/utils';
import { useLazyGetEventsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import { useDispatch } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { useFixturesPooling } from './useFixturesPooling';

type ConfigSettings = {
  useMatchDayGrid?: boolean,
  useScoutAccessManagement?: boolean,
  useMatchMonitor?: boolean,
  canViewMatchRoster?: boolean,
  canManageLeagueGames?: boolean,
  hasScoutAccessLimitations?: boolean,
  eventRefreshInterval?: number,
  isScoutAttendeesEnabled?: boolean,
};

type Props = {
  filters: EventFilters,
  userEventRequests?: Array<UserEventRequest>,
  setUserEventRequests?: (Array<UserEventRequest>) => void,
  configSettings?: ConfigSettings,
  onClickEditEvent?: (Game) => void,
  handleRedirect?: (gameId: number) => void,
  handleSetMenuButtonAction?: (id: number, type: string) => void,
};

const useGridConfig = (props: Props) => {
  const {
    filters,
    userEventRequests,
    setUserEventRequests,
    configSettings,
    onClickEditEvent,
    handleRedirect,
    handleSetMenuButtonAction,
  } = props;

  const { isLeague, isLeagueStaffUser, isScout, organisationId } =
    useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();
  const dispatch = useDispatch();

  const canManageScoutAccess =
    permissions?.scoutAccessManagement?.canManageScoutAccess;
  const canViewScoutFixtures =
    permissions?.scoutAccessManagement?.canViewScoutFixtures;

  const showMatchDayColumn = !!preferences?.league_game_match_day;
  const showMatchMonitorColumn =
    !!preferences?.match_monitor &&
    !!window.getFlag('league-ops-match-monitor-v3') &&
    !!permissions?.matchMonitor?.manageMatchMonitorReport &&
    isLeague;

  const [
    fetchEvents,
    {
      isError,
      isFetching,
      isSuccess: isFixturesFetchSuccess,
      currentData: { events: fixtures = [], next_id: nextId } = {},
      fulfilledTimeStamp: lastUpdatedAtList,
    },
  ] = useLazyGetEventsQuery();

  const { isScoutAttendeesEnabled = false } = configSettings ?? {};

  const eventIds = fixtures.map((event) => event.id);

  const { data: fixturesUpdates, fulfilledTimeStamp: lastUpdatedAtDmrData } =
    useFixturesPooling({
      eventIds,
      interval: configSettings?.eventRefreshInterval ?? 0,
      skip: !isLeagueStaffUser,
    });

  const actualizedFixtures = useMemo(() => {
    if (!fixturesUpdates.length) {
      return fixtures;
    }

    return cloneDeep(fixtures).map((event) => {
      const currentEventState = fixturesUpdates.find(
        (item) => item.event_id === event.id
      );

      if (!currentEventState) {
        return event;
      }

      return {
        ...event,
        home_dmr: currentEventState.home_dmr_status,
        away_dmr: currentEventState.away_dmr_status,
      };
    });
  }, [fixtures, fixturesUpdates]);

  const getNextFixtures = () =>
    fetchEvents({
      filters,
      nextId,
      reset: false,
    });

  const refetchFixtures = () =>
    fetchEvents({
      filters,
      nextId: null,
      reset: true,
    });

  useEffect(() => {
    fetchEvents({
      filters,
      nextId: null,
      reset: false,
    });
  }, [filters]);

  let columns = getLeagueScheduleHeaders(
    showMatchDayColumn,
    showMatchMonitorColumn
  );
  let rightPinnedColumns = [];
  if (configSettings?.useMatchDayGrid) {
    columns = MatchDayScheduleHeaders;
    if (isLeagueStaffUser) columns = [...columns, MatchDayStatusHeader];
    if (isLeague) columns = [...columns, MatchDayActionsHeader];
  } else if (
    configSettings?.useScoutAccessManagement &&
    !isLeagueStaffUser &&
    (canManageScoutAccess || canViewScoutFixtures)
  ) {
    columns = [
      ...columns,
      ...(isScoutAttendeesEnabled && canManageScoutAccess
        ? [getScoutAttendeesHeader()]
        : []),
      getAccessStatusHeader(canManageScoutAccess),
      getLockStatusHeader(),
      getScoutAccessActionsHeader({
        doesHaveExternalAccessActions: canManageScoutAccess,
      }),
    ];
    rightPinnedColumns = ['actions'];
  } else {
    if (
      isLeagueStaffUser &&
      configSettings?.useScoutAccessManagement &&
      (canManageScoutAccess || canViewScoutFixtures)
    ) {
      columns = [
        ...columns,
        getAccessStatusHeader(true),
        getLockStatusHeader(),
      ];
    }
    if (isLeagueStaffUser && !isScout) {
      columns = [...columns, getStatusHeader()];
    }
    if (isLeague) {
      columns = [...columns, LeagueScheduleActionsHeader];
      rightPinnedColumns = ['actions'];
    }
  }

  let rows = [];
  if (configSettings?.useMatchDayGrid) {
    rows = getMatchDayScheduleRowData({
      matchDayRows: actualizedFixtures,
      isLeague,
      onClickEditEvent,
      dispatch,
      refetch: refetchFixtures,
      canEditFixture:
        configSettings?.canManageLeagueGames &&
        permissions.leagueGame?.manageGameInformation,
    });
  } else if (configSettings?.useScoutAccessManagement && !isLeagueStaffUser) {
    rows = getScoutAccessManagementRowData({
      scheduleRows: actualizedFixtures,
      userEventRequests,
      setUserEventRequests,
      orgId: organisationId,
      canManageScoutAccess,
      handleSetMenuButtonAction,
      hasScoutAccessLimitations: configSettings.hasScoutAccessLimitations,
    });
  } else {
    rows = getLeagueScheduleRowData({
      scheduleRows: actualizedFixtures,
      handleRedirect,
      handleSetMenuButtonAction,
      useMatchMonitor: configSettings?.useMatchMonitor,
      onClickEditEvent,
      canViewMatchRoster:
        configSettings?.canViewMatchRoster &&
        permissions?.leagueGame.manageGameTeam,
      canViewMatchRequests:
        configSettings?.useScoutAccessManagement &&
        permissions?.scoutAccessManagement?.canManageScoutAccess,
      canViewMatchReport: permissions?.leagueGame?.viewMatchReport,
      canManageMatchReport: permissions?.leagueGame?.manageMatchReport,
      canViewMatchMonitorReport:
        permissions?.matchMonitor?.viewMatchMonitorReport,
      canManageMatchMonitorReport:
        permissions?.matchMonitor?.manageMatchMonitorReport,
      canEditFixture:
        configSettings?.canManageLeagueGames &&
        permissions.leagueGame?.manageGameInformation,
    });
  }

  const muiDataGridProps = {
    disableColumnReorder: true,
    disableColumnResize: true,
    disableColumnMenu: true,
    disableColumnFilter: true,
    editMode: undefined,
    hideFooter: true,
    sx: {
      outline: 'none',
      border: 0,
      boxShadow: 0,
      '.MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell':
        {
          overflow: 'visible',
        },
      '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus, .MuiCheckbox-root:focus, .MuiDataGrid-cell:focus-within':
        {
          outline: 'none',
        },
    },
  };

  const dataGridCustomStyle = {
    ...muiDataGridProps.sx,
    '&, [class^=MuiDataGrid]': {
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
    },
    '&, [class^=MuiDataGrid-row--lastVisible]': {
      borderBottom: 'none',
    },
    '.MuiDataGrid-virtualScroller': {
      minHeight: '200px',
    },
  };

  const lastUpdatedAt = useMemo(() => {
    if (lastUpdatedAtList && lastUpdatedAtDmrData) {
      return Math.max(lastUpdatedAtList, lastUpdatedAtDmrData);
    }

    return lastUpdatedAtDmrData ?? lastUpdatedAtList ?? Date.now();
  }, [lastUpdatedAtList, lastUpdatedAtDmrData]);

  return {
    columns,
    rightPinnedColumns,
    rows,
    fixtures,
    muiDataGridProps,
    dataGridCustomStyle,
    isError,
    isFetching,
    isFixturesFetchSuccess,
    nextId,
    getNextFixtures,
    refetchFixtures,
    lastUpdatedAt,
  };
};

export default useGridConfig;
