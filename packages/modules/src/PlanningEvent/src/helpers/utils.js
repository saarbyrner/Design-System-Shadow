// @flow
import _isNull from 'lodash/isNull';
import {
  getOpponentName,
  getOrgTeamName,
} from '@kitman/common/src/utils/workload';
import type { CalendarSettingsPermissions } from '@kitman/common/src/contexts/PermissionsContext/calendarSettings/types';
import type {
  EventActivityGlobalStateResponse,
  EventActivityGlobalState,
} from '@kitman/modules/src/PlanningEvent/src/types/common';
import type { Event } from '@kitman/common/src/types/Event';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import structuredClone from 'core-js/stable/structured-clone';
import type { SetState } from '@kitman/common/src/types/react';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';

type PermissionTitleTypes =
  | 'create-custom-event'
  | 'edit-custom-event'
  | 'delete-custom-event'
  | 'super-admin-custom-event';

export const calculatePermission = (
  permissionList?: Array<string>,
  permissionTitle: PermissionTitleTypes
): boolean => {
  if (window.featureFlags['custom-events']) {
    if (window.featureFlags['staff-visibility-custom-events']) {
      return permissionList ? permissionList.includes(permissionTitle) : false;
    }
    return true;
  }
  return false;
};

export const checkCustomEventPermissionObject = (
  permissionObject: CalendarSettingsPermissions,
  permissionTitle: string
) => {
  if (window.featureFlags['custom-events']) {
    if (window.featureFlags['staff-visibility-custom-events']) {
      return (
        permissionObject[permissionTitle] ||
        permissionObject.isSuperAdminCustomEventCalendar
      );
    }
    return true;
  }
  return false;
};

export const getPlayerNumber = (jerseyNumber?: ?number) => {
  if (jerseyNumber === -1) return '#00';
  if (jerseyNumber === 0) return '#0';
  return `#${jerseyNumber || ''}`;
};

export const mapEventActivityGlobalState = (
  data: Array<EventActivityGlobalStateResponse>
): Array<EventActivityGlobalState> =>
  data.map((s) => ({
    eventActivityId: s.event_activity_id,
    state: s.state,
    count: s.count,
    totalCount: s.total_count,
  }));

export const getEventName = ({
  event,
  squadName,
  isPitchViewToggleEnabled,
  isDmnDmrLeagueGame,
}: {
  event: Event,
  squadName: string,
  isPitchViewToggleEnabled: boolean,
  isDmnDmrLeagueGame: boolean,
}): string => {
  switch (event.type) {
    case 'session_event':
      if (event.name) return event.name;
      if (event.theme?.name) return event.theme.name;
      return event.session_type.name;
    case 'game_event': {
      const orgName = getOrgTeamName({
        squadName,
        organisationTeamName: event.organisation_team?.name,
        organisationOwnerName: event.squad?.owner_name,
        isLeague: isDmnDmrLeagueGame,
      });
      const opponentName = getOpponentName(event);
      const separator = isPitchViewToggleEnabled ? 'v' : 'vs';
      const gameName = orgName
        ? `${orgName} ${separator} ${opponentName}`
        : opponentName;

      const score = event.score;
      const opponentScore = event.opponent_score;
      const gameScore = [score, opponentScore].some(_isNull)
        ? ''
        : `(${event.score}-${event.opponent_score})`;

      if (isPitchViewToggleEnabled) {
        return gameName;
      }
      return `${gameName} ${gameScore}`;
    }
    default:
      return event.name ?? '';
  }
};

export const getPermission = ({
  event,
  permissions,
  name,
}: {
  event: ?Event,
  permissions: PermissionsType,
  name: 'edit' | 'delete',
}) => {
  if (!event?.type) return false;

  const eventType = event.type;
  const isGameEvent = eventType === 'game_event';
  const isSessionEvent = eventType === 'session_event';
  const isCustomEvent = eventType === 'custom_event';
  const trainingSession = permissions?.workloads?.trainingSessions;
  const gamePermission = permissions?.workloads?.games;
  const calendarPermission = permissions?.calendarSettings;

  if (name === 'edit') {
    return (
      (isSessionEvent && trainingSession?.canEdit) ||
      (isGameEvent && gamePermission?.canEdit) ||
      (isCustomEvent &&
        checkCustomEventPermissionObject(
          calendarPermission,
          'canEditCustomEventCalendar'
        ))
    );
  }

  if (name === 'delete') {
    return (
      (isSessionEvent && trainingSession?.canDelete) ||
      (isGameEvent && gamePermission?.canDelete) ||
      (isCustomEvent &&
        checkCustomEventPermissionObject(
          calendarPermission,
          'canDeleteCustomEventCalendar'
        ))
    );
  }

  return false;
};

/**
 * Function to handle updating the respective compliance statuses for club/league event information where necessary.
 * @param  {boolean} isLeague
 * @param  {Object} updatedEvent (event object with updated attributes FLOW misinterprets it as possibly being a session/custom/game)
 * @param  {Event} leagueEvent (the parent league event object with references to home/away info)
 * @param  {Function} updateClubEvent
 * @param  {SetState<Event>} updateLeagueEvent
 */
export const updateClubAndLeagueEventsCompliance = ({
  isLeague,
  updatedEvent,
  leagueEvent,
  updateClubEvent,
  updateLeagueEvent,
}: {
  isLeague: boolean,
  updatedEvent: Object,
  leagueEvent: Event,
  updateClubEvent: Function,
  updateLeagueEvent: SetState<Event>,
}) => {
  updateClubEvent(updatedEvent, true);
  if (isLeague && updatedEvent?.type === eventTypePermaIds.game.type) {
    const updatedLeagueDmrAttribute =
      updatedEvent?.venue_type?.name === venueTypes.home
        ? 'home_dmr'
        : 'away_dmr';
    const updatedLeagueEvent = structuredClone(leagueEvent);
    updatedLeagueEvent[updatedLeagueDmrAttribute] = updatedEvent?.dmr;
    updateLeagueEvent(updatedLeagueEvent);
  }
};

/**
 * Gets the Viewer Page link for the MLS/KLS based on the environment we are in.
 * As dev is its own local static viewer page site, staging/dev point to the same location
 * production points to its own. Appends the division/org when necessary.
 * @param  {string} divisionName (example: kls-next, kls)
 * @param  {string} orgName (example: kls)
 * @return {string} viewerPageLink (example: https://mls-assist.theintelligenceplatform.com/?org=mls&division=mls-next-pro)
 */
export const getViewerPageLink = (divisionName?: string, orgName?: string) => {
  const hostname = window.location.href;
  let viewerPageLink = 'https://mls-assist.theintelligenceplatform.com/';
  if (hostname.includes('staging') || hostname.includes('test')) {
    viewerPageLink = 'https://mls-assist.staging.theintelligenceplatform.com/';
  }

  const params = new URLSearchParams();

  if (orgName) {
    params.set('org', orgName);
  }
  if (divisionName) {
    params.set('division', divisionName);
  }

  return `${viewerPageLink}?${params.toString()}`;
};
