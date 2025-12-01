// @flow
import $ from 'jquery';
import type { Event } from '@kitman/common/src/types/Event';
import type { GridData, AthleteFilter } from '../../types';

const getEventAthletesGrid = (
  event: Event,
  nextId: ?number,
  filters: AthleteFilter
): Promise<GridData> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${event.id}/athlete_tab`,
      contentType: 'application/json',
      data: JSON.stringify({
        filters,
        next_id: nextId || null,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getEventAthletesGrid;
