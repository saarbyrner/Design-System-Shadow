// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Event } from '@kitman/common/src/types/Event';

const getPlanningHubEvent = async ({
  eventId,
  showAthletesAndStaff,
  supervisorView,
  includeGraduationDate,
  originalStartTime,
  includeDmrStatus,
  includeChildDmrStatuses,
  includeDmrBlockedTime,
  includeNotificationStatus,
  includeTvInfo,
  includeRRuleInstance,
  includeDivision,
}: {
  eventId: number,
  showAthletesAndStaff?: boolean,
  supervisorView?: boolean,
  includeGraduationDate?: boolean,
  originalStartTime?: ?string,
  includeDmrStatus?: boolean,
  includeChildDmrStatuses?: boolean,
  includeDmrBlockedTime?: boolean,
  includeNotificationStatus?: boolean,
  includeTvInfo?: boolean,
  includeRRuleInstance?: boolean,
  includeDivision?: boolean,
}): Promise<{ event: Event, eventId: number }> => {
  const planningEventUrl = `/planning_hub/events/${eventId}`;
  let urlParams = {};

  if (showAthletesAndStaff) {
    urlParams = {
      ...urlParams,
      include_home_athletes: true,
      include_away_athletes: true,
      include_home_event_users: true,
      include_away_event_users: true,
    };
  }
  if (supervisorView) {
    urlParams = {
      ...urlParams,
      supervisor_view: true,
    };
  }
  if (includeGraduationDate) {
    urlParams = {
      ...urlParams,
      include_graduation_date: true,
    };
  }
  if (originalStartTime) {
    urlParams = {
      ...urlParams,
      original_start_time: originalStartTime,
    };
  }
  if (includeDmrStatus) {
    urlParams = {
      ...urlParams,
      include_dmr: true,
    };
  }
  if (includeChildDmrStatuses) {
    urlParams = {
      ...urlParams,
      include_home_dmr: true,
      include_away_dmr: true,
    };
  }
  if (includeDmrBlockedTime) {
    urlParams = {
      ...urlParams,
      include_game_participants_lock_time: true,
    };
  }
  if (includeNotificationStatus) {
    urlParams = {
      ...urlParams,
      include_dmn_notification_status: true,
      include_dmr_notification_status: true,
    };
  }
  if (includeTvInfo) {
    urlParams = {
      ...urlParams,
      include_tv_channels: true,
      include_tv_game_contacts: true,
    };
  }
  if (includeRRuleInstance) {
    urlParams = {
      ...urlParams,
      include_rrule_instance: true,
    };
  }
  if (includeDivision) {
    urlParams = {
      ...urlParams,
      include_division: true,
    };
  }

  const { data } = await axios.get(planningEventUrl, {
    params: urlParams,
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  });
  return data;
};

export default getPlanningHubEvent;
