// @flow
import $ from 'jquery';
import type { AthleteEvent } from '@kitman/common/src/types/Event';
import type { AthleteFilter } from '../../types';

const searchAthletes = (
  eventId: number,
  filters: AthleteFilter,
  excludeNonParticipatingAthletes: boolean = false
): Promise<Array<AthleteEvent>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/athlete_events/search`,
      contentType: 'application/json',
      data: JSON.stringify({
        filters: {
          ...filters,
          non_none_participation_level: excludeNonParticipatingAthletes,
        },
      }),
    })
      .done((data) => {
        return resolve(data);
      })
      .fail(() => reject());
  });
};

export default searchAthletes;
