// @flow
import $ from 'jquery';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';

export const getEventPeriods = ({
  eventId,
  supervisorView,
}: {
  eventId: number,
  supervisorView?: boolean,
}): Promise<Array<GamePeriod>> => {
  return new Promise((resolve, reject) => {
    let url = `/ui/planning_hub/events/${eventId}/game_periods`;

    if (supervisorView) {
      url += '?supervisor_view=true';
    }

    $.ajax({
      method: 'GET',
      url,
      contentType: 'application/json',
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const addEventPeriod = (
  eventId: number,
  name: string,
  duration: number,
  additionalDuration: ?number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_periods`,
      contentType: 'application/json',
      data: JSON.stringify({
        name,
        duration,
        additional_duration: additionalDuration,
      }),
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};

export const deleteEventPeriod = (
  eventId: number,
  periodId: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/ui/planning_hub/events/${eventId}/game_periods/${periodId}`,
      contentType: 'application/json',
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};

export const updateEventPeriod = (
  eventId: number,
  periodId: number,
  name: string,
  duration: number,
  additionalDuration: ?number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/ui/planning_hub/events/${eventId}/game_periods/${periodId}`,
      contentType: 'application/json',
      data: JSON.stringify({
        name,
        duration,
        additional_duration: additionalDuration,
      }),
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};

export const updateEventPeriodOrder = (
  eventId: number,
  orderedPeriodIds: Array<number>
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_periods/reorder`,
      contentType: 'application/json',
      data: JSON.stringify({
        ids: orderedPeriodIds,
      }),
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};

export const duplicateEventPeriod = (
  eventId: number,
  periodId: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_periods/${periodId}/duplicate`,
      contentType: 'application/json',
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });
};
