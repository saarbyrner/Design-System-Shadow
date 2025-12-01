// @flow
import $ from 'jquery';
import type { Event } from '@kitman/common/src/types/Event';
import type { EventFilters } from '../../types';

const getEvents = (
  eventFilters: EventFilters,
  nextIdToFetch: ?number
): Promise<{ events: Array<Event>, next_id: ?number }> => {
  return new Promise((resolve, reject) => {
    let data = {
      date_range: eventFilters.dateRange,
      event_types: eventFilters.eventTypes,
      competitions: eventFilters.competitions,
      game_days: eventFilters.gameDays,
      oppositions: eventFilters.oppositions,
      search_expression: eventFilters.search_expression || '',
      include_game_status: eventFilters.include_game_status || false,
      next_id: nextIdToFetch,
      squad_names: eventFilters.squad_names || [],
      statuses: eventFilters.statuses || [],
      organisations: eventFilters.organisations || [],
      supervisor_view: eventFilters.supervisor_view || false,
      start_time_asc: eventFilters.start_time_asc || false,
      recurring_events: eventFilters.areRecurringEventsIncluded ?? false,
      include_user_event_requests_counts:
        !!eventFilters.includeUserEventRequestsCounts,
      round_number: eventFilters.round_number || '',
      include_division: !!eventFilters.include_division,
      include_scout_attendees: eventFilters.include_scout_attendees,
    };

    if (
      eventFilters.include_kit_matrix &&
      eventFilters.include_game_kit_matrix &&
      eventFilters.include_time &&
      eventFilters.include_home_dmr &&
      eventFilters.include_away_dmr &&
      eventFilters.include_game_participants_lock_time
    ) {
      data = {
        ...data,
        include_kit_matrix: true,
        include_game_kit_matrix: true,
        include_time: true,
        include_home_dmr: true,
        include_away_dmr: true,
        include_game_participants_lock_time: true,
      };
    }

    if (
      eventFilters.include_tv_channels &&
      eventFilters.include_tv_game_contacts
    ) {
      data = {
        ...data,
        include_tv_channels: true,
        include_tv_game_contacts: true,
      };
    }
    if (eventFilters.user_event_requests_statuses) {
      data = {
        ...data,
        user_event_requests_statuses: eventFilters.user_event_requests_statuses,
      };
    }

    if (eventFilters.include_match_director) {
      data = {
        ...data,
        include_match_director: true,
      };
    }

    if (eventFilters.include_match_monitors) {
      data = {
        ...data,
        include_match_monitors: true,
        include_game_monitor_report_submitted: true,
      };
    }

    if (eventFilters.include_access_request_accessible) {
      data = {
        ...data,
        include_access_request_accessible: true,
      };
    }

    if (eventFilters.include_access_request_time_valid) {
      data = {
        ...data,
        include_access_request_time_valid: true,
      };
    }

    if (eventFilters.include_association_contact) {
      data = {
        ...data,
        include_association_contact: true,
      };
    }

    if (eventFilters.include_visible) {
      data = {
        ...data,
        include_visible: true,
      };
    }

    $.ajax({
      method: 'POST',
      url: '/planning_hub/events/search',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getEvents;
