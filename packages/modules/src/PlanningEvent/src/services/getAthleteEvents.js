// @flow
import $ from 'jquery';
import type { AthleteEvent } from '@kitman/common/src/types/Event';

type AthleteEventApiParams = {
  includeSquadName?: boolean,
  includeSquadNumber?: boolean,
  includePositionGroup?: boolean,
  includeDesignation?: boolean,
  forceLatest?: boolean,
};

const getAthleteEvents = (
  eventId: number,
  apiParams?: AthleteEventApiParams
): Promise<Array<AthleteEvent>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/planning_hub/events/${eventId}/athlete_events`,
      contentType: 'application/json',
      data: {
        include_squad_name: !!apiParams?.includeSquadName,
        include_position_group: !!apiParams?.includePositionGroup,
        include_squad_number: !!apiParams?.includeSquadNumber,
        include_designation: !!apiParams?.includeDesignation,
        force_latest: !!apiParams?.forceLatest,
      },
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getAthleteEvents;
