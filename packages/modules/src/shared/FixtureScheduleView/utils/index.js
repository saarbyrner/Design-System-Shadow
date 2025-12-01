// @flow
import moment from 'moment-timezone';

import {
  formatJustTimeWithAMPM,
  formatShort,
} from '@kitman/common/src/utils/dateFormatter';
import i18n from '@kitman/common/src/utils/i18n';
import type { Game } from '@kitman/common/src/types/Event';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import { FALLBACK_DASH } from '@kitman/common/src/variables';
import { getTeamMatchDayCompletionStatus } from '@kitman/common/src/utils/planningEvent';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import type {
  Action,
  ThunkAction,
} from '@kitman/modules/src/CalendarPage/src/types';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';

import FallbackCrest from '../FallbackCrest';
import {
  menuButtonTypes,
  fixtureReports,
  getFormattedScore,
  getFormattedStartDate,
  getFormattedStartTime,
  getGameStatusData,
} from '../helpers';

const findKitMatrixByType = (kitMatrix, type) =>
  kitMatrix
    ? kitMatrix.find((kitMatrixList) => kitMatrixList.kind === type)
    : [];

const handleUpdateDmrLockStatus = async ({
  eventId,
  lockStatus,
  dispatch,
  refetch,
}: {
  eventId: number,
  lockStatus: boolean,
  dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
  refetch: () => void,
}) => {
  saveEvent({
    event: { id: eventId, game_participants_unlocked: lockStatus },
    urlFilterParams: { includeDmrLockedTime: true },
  })
    .then(() => {
      refetch();
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: i18n.t('DMR lock status changed'),
        })
      );
    })
    .catch(() =>
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: i18n.t('Failed to change DMR lock status'),
        })
      )
    );
};

export const getReportTextType = (isMatchMonitor: boolean) => {
  if (isMatchMonitor) return 'match monitor';
  return 'match';
};

export const getFixtureReportType = (preferences?: PreferenceType) => {
  if (preferences?.match_monitor) {
    return fixtureReports.matchMonitorReport;
  }

  return fixtureReports.matchReport;
};

const getGeneralRowData = (event: Game) => {
  const homeLogoPath = event?.squad?.logo_full_path;
  const homeTeamName = event?.squad?.owner_name;
  const opponent = event?.opponent_squad || event.opponent_team;
  const matchMonitors = event?.match_monitors || [];

  const squadName =
    event?.squad?.name || event?.opponent_squad?.name || FALLBACK_DASH;

  const gameScore = getFormattedScore(event);

  return {
    id: event.id,
    homeTeam: homeTeamName || FALLBACK_DASH,
    awayTeam: opponent?.owner_name || FALLBACK_DASH,
    homeTeamIcon: homeLogoPath || <FallbackCrest />,
    awayTeamIcon: opponent?.logo_full_path || <FallbackCrest />,
    score: gameScore,
    matchId: event.mls_game_key || FALLBACK_DASH,
    round_number: event.round_number || FALLBACK_DASH,
    squad: squadName,
    competition: event?.competition?.name || FALLBACK_DASH,
    date: getFormattedStartDate(event) || FALLBACK_DASH,
    time: getFormattedStartTime(event) || FALLBACK_DASH,
    location: event?.event_location?.name || FALLBACK_DASH,
    matchMonitors,
  };
};

export const getLeagueScheduleRowData = ({
  scheduleRows,
  handleRedirect,
  handleSetMenuButtonAction,
  onClickEditEvent,
  canViewMatchRoster,
  canViewMatchRequests,
  useMatchMonitor,
  canViewMatchReport,
  canManageMatchReport,
  canViewMatchMonitorReport,
  canManageMatchMonitorReport,
  canEditFixture,
}: {
  scheduleRows: Array<Game>,
  handleRedirect?: (gameId: number) => void,
  handleSetMenuButtonAction?: (id: number, type: string) => void,
  onClickEditEvent?: (Game) => void,
  canViewMatchRoster?: boolean,
  useMatchMonitor?: boolean,
  canViewMatchRequests?: boolean,
  canViewMatchReport?: boolean,
  canManageMatchReport?: boolean,
  canViewMatchMonitorReport?: boolean,
  canManageMatchMonitorReport?: boolean,
  canEditFixture?: boolean,
}): Array<Object> =>
  scheduleRows.map((event) => {
    const gameStatusData = getGameStatusData(event?.game_status);
    return {
      ...getGeneralRowData(event),
      status: {
        chipLabel: gameStatusData?.name || FALLBACK_DASH,
        chipStyle: gameStatusData?.style,
      },
      accessStatus: {
        numberOfRequests: event?.user_event_requests_counts,
      },
      lock: {
        isLocked: !event?.access_request_time_valid,
      },
      actions: {
        canViewMatchRoster,
        isMatchMonitor: useMatchMonitor,
        reportSubmitted: useMatchMonitor
          ? !!event?.game_monitor_report_submitted
          : !!event?.match_report_submitted_by_id,
        viewActionRedirect: handleRedirect,
        handleMenuButtonAction: (menuButtonType: string) =>
          handleSetMenuButtonAction?.(event.id, menuButtonType),
        onClickEditEvent: () => onClickEditEvent?.(event),
        canViewMatchRequests,
        canViewMatchReport,
        canManageMatchReport,
        canViewMatchMonitorReport,
        canManageMatchMonitorReport,
        canEditFixture,
      },
    };
  });

export const getScoutAccessManagementRowData = ({
  scheduleRows,
  userEventRequests,
  setUserEventRequests,
  orgId,
  canManageScoutAccess,
  handleSetMenuButtonAction,
  hasScoutAccessLimitations,
}: {
  scheduleRows: Array<Game>,
  userEventRequests?: Array<UserEventRequest>,
  setUserEventRequests?: (Array<UserEventRequest>) => void,
  orgId?: number,
  canManageScoutAccess?: boolean,
  handleSetMenuButtonAction?: (id: number, type: string) => void,
  hasScoutAccessLimitations?: boolean,
}): Array<Object> =>
  scheduleRows.map((event) => {
    // TODO: Remove isPastGame and isHomeTeamOrgEqualToUsersOrg when backend logic tested
    const isPastGame = moment(event.start_date).isBefore(
      moment().subtract(1, 'days'),
      'day'
    );
    const isHomeTeamOrgEqualToUsersOrg = event.squad?.owner_id === orgId;

    const userEventRequestForRow = userEventRequests?.find(
      (request) => request.event.id === event.id
    );

    const isRequestWithdrawlable =
      userEventRequestForRow?.status === userEventRequestStatuses.approved ||
      userEventRequestForRow?.status === userEventRequestStatuses.pending;

    const isScoutRequestAllowed = hasScoutAccessLimitations
      ? event?.access_request_accessible
      : !(isPastGame || isHomeTeamOrgEqualToUsersOrg);

    const isActionsVisible = canManageScoutAccess
      ? isScoutRequestAllowed
      : isRequestWithdrawlable;

    return {
      ...getGeneralRowData(event),
      accessStatus: {
        numberOfRequests: event?.user_event_requests_counts,
        requestButtonViewable: isScoutRequestAllowed,
        userEventRequest: userEventRequestForRow,
        userEventRequests,
        setUserEventRequests,
        eventId: event.id,
      },
      scoutAttendees: event?.scout_attendees ?? [],
      lock: {
        isLocked: !event?.access_request_time_valid,
      },
      actions: {
        event,
        isVisible: isActionsVisible,
        handleMenuButtonAction: () =>
          handleSetMenuButtonAction?.(
            +userEventRequestForRow?.id,
            menuButtonTypes.withdraw
          ),
      },
    };
  });

export const getMatchDayScheduleRowData = ({
  matchDayRows,
  isLeague,
  onClickEditEvent,
  dispatch,
  refetch,
  canEditFixture,
}: {
  matchDayRows: Array<Game>,
  isLeague: boolean,
  onClickEditEvent?: (Game) => void,
  dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
  refetch: () => void,
  canEditFixture?: boolean,
}): Array<Object> =>
  matchDayRows.map((event) => {
    const eventLockTime =
      event.type === eventTypePermaIds.game.type
        ? moment(event.game_participants_lock_time)
        : '';
    const eventGameTime =
      event.type === eventTypePermaIds.game.type && event?.game_time
        ? formatJustTimeWithAMPM(
            moment.tz(event?.game_time, event?.local_timezone)
          )
        : '';
    const isDmrLockedFromTime = moment().isAfter(eventLockTime);
    const isDmrPastStartTime = moment().isAfter(event.start_date);

    const isClubAwayTeam =
      !isLeague && event?.venue_type?.name === venueTypes.away;
    const homeSquad = isClubAwayTeam ? event.opponent_squad : event.squad;
    const awaySquad = isClubAwayTeam ? event.squad : event.opponent_squad;

    const homeKitsExist =
      !!findKitMatrixByType(event.kit_matrix, `home_player`) &&
      !!findKitMatrixByType(event.kit_matrix, `home_goalkeeper`);

    return {
      id: event.id,
      homeTeam: homeSquad?.owner_name || FALLBACK_DASH,
      awayTeam: awaySquad?.owner_name || FALLBACK_DASH,
      homeTeamIcon: homeSquad?.logo_full_path,
      awayTeamIcon: awaySquad?.logo_full_path,
      skipAutomaticGameTeamEmail: event?.skip_automatic_game_team_email,
      round: event.round_number || FALLBACK_DASH,
      matchId:
        (event.type === eventTypePermaIds.game.type && event.mls_game_key) ||
        FALLBACK_DASH,
      date: formatShort(moment.tz(event.start_date, event?.local_timezone)),
      time: `${eventGameTime} ${moment.tz(event?.local_timezone).zoneAbbr()}`,
      kickTime: `${formatJustTimeWithAMPM(
        moment.tz(event.start_date, event?.local_timezone)
      )} ${moment.tz(event?.local_timezone).zoneAbbr()}`,
      homePlayer: {
        data: findKitMatrixByType(event.kit_matrix, `home_player`),
      },
      homeGoalkeeper: {
        data: findKitMatrixByType(event.kit_matrix, `home_goalkeeper`),
      },
      awayPlayer: {
        data: findKitMatrixByType(event.kit_matrix, `away_player`),
        isDisabled: homeKitsExist,
      },
      awayGoalkeeper: {
        data: findKitMatrixByType(event.kit_matrix, `away_goalkeeper`),
        isDisabled: homeKitsExist,
      },
      referee: { data: findKitMatrixByType(event.kit_matrix, 'referee') },
      dmr: {
        home: getTeamMatchDayCompletionStatus({
          competitionConfig:
            event.type === eventTypePermaIds.game.type
              ? event.competition
              : undefined,
          dmrStatuses:
            event.type === eventTypePermaIds.game.type ? event?.home_dmr : [],
          isHomeStatuses: true,
        }),
        away: getTeamMatchDayCompletionStatus({
          competitionConfig:
            event.type === eventTypePermaIds.game.type
              ? event.competition
              : undefined,
          dmrStatuses:
            event.type === eventTypePermaIds.game.type ? event?.away_dmr : [],
        }),
      },
      countdown: {
        startDate: moment(event.start_date),
        isDmrLocked: isDmrLockedFromTime || isDmrPastStartTime,
      },
      actions: {
        // the dmr is unlocked as long as it is before the lock time
        // if it is past the start time it cant be unlocked via this button (so acts as it is)
        isDmrUnlocked: !isDmrLockedFromTime || isDmrPastStartTime,
        unlockDmr: (eventId: number, lockStatus: boolean) =>
          handleUpdateDmrLockStatus({ eventId, lockStatus, dispatch, refetch }),
        openEdit: () => onClickEditEvent?.(event),
        canEditFixture,
      },
    };
  });
