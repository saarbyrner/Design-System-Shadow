// @flow
import $ from 'jquery';

import type { AthleteFilter } from '../../types';

type Params = {
  eventId: number,
  nextId: ?number,
  filters: ?AthleteFilter,
};

export default function fetchWorkloadGrid({
  eventId,
  nextId,
  filters,
}: Params): Promise<Object> {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/collections_tab`,
      contentType: 'application/json',
      data: JSON.stringify({
        next_id: nextId,
        filters,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
}
