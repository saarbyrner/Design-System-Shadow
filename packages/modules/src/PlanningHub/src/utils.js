// @flow
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';

export const getDefaultEventFilters = ({
  isReportFilters,
  preferences,
  isSupervisorView,
  isGameEvents,
  isLeague,
  isScoutAccess,
  canManageScoutAccess,
  organisationId,
  isScoutAttendeesEnabled = false,
}: {
  isReportFilters?: boolean,
  preferences?: PreferenceType,
  isSupervisorView?: boolean,
  isGameEvents?: boolean,
  isLeague?: boolean,
  isScoutAccess?: boolean,
  canManageScoutAccess?: boolean,
  organisationId?: number,
  isScoutAttendeesEnabled?: boolean,
}): EventFilters => {
  const isLeagueGameSchedule = preferences?.league_game_schedule;

  let startDateOffset = 28;
  let endDateOffset = 28;
  if (isReportFilters) {
    startDateOffset = 10;
    endDateOffset = 10;
  }
  if (isLeagueGameSchedule) {
    startDateOffset = 0;
    endDateOffset = 14;
  }

  let defaultFilters = {
    dateRange: {
      start_date: moment()
        .subtract(startDateOffset, 'days')
        .format(DateFormatter.dateTransferFormat),
      end_date: moment()
        .endOf('day')
        .add(endDateOffset, 'days')
        .format(DateFormatter.dateTransferFormat),
    },
    eventTypes: [],
    competitions: [],
    gameDays: [],
    oppositions: [],
    search_expression: '',
    round_number: '',
  };

  if (preferences?.league_game_notification_recipient) {
    defaultFilters = { ...defaultFilters, include_association_contact: true };
  }

  if (preferences?.league_game_hide_club_game) {
    defaultFilters = { ...defaultFilters, include_visible: true };
  }

  if (isGameEvents) {
    defaultFilters = {
      ...defaultFilters,
      eventTypes: ['game_event'],
    };
  }

  if (isReportFilters) {
    defaultFilters = {
      ...defaultFilters,
      include_game_status: true,
      start_time_asc: true,
      statuses: [],
      organisations: [],
      squad_names: [],
    };
  }

  if (isSupervisorView) {
    defaultFilters = { ...defaultFilters, supervisor_view: true };
  }

  if (window.getFlag('repeat-events') || window.getFlag('repeat-sessions'))
    defaultFilters = {
      ...defaultFilters,
      areRecurringEventsIncluded: true,
    };

  if (isLeague && isLeagueGameSchedule) {
    defaultFilters = {
      ...defaultFilters,
      organisations: [],
    };
  }

  if (isLeagueGameSchedule)
    defaultFilters = {
      ...defaultFilters,
      include_kit_matrix: true,
      include_game_kit_matrix: true,
      include_time: true,
      include_home_dmr: true,
      include_away_dmr: true,
      include_game_participants_lock_time: true,
      include_match_director: true,
      include_tv_channels: true,
      include_tv_game_contacts: true,
    };

  if (isScoutAccess || preferences?.scout_access_management) {
    defaultFilters = {
      ...defaultFilters,
      user_event_requests_statuses: [],
      include_access_request_accessible: true,
      include_access_request_time_valid: true,
    };

    if (canManageScoutAccess) {
      defaultFilters = {
        ...defaultFilters,
        includeUserEventRequestsCounts: true,
        include_scout_attendees: isScoutAttendeesEnabled,
      };

      if (!isLeague && organisationId) {
        defaultFilters = {
          ...defaultFilters,
          organisations: [organisationId],
        };
      }
    }
  }

  if (preferences?.match_monitor)
    defaultFilters = { ...defaultFilters, include_match_monitors: true };

  if (isLeague) defaultFilters = { ...defaultFilters, include_division: true };

  return defaultFilters;
};
