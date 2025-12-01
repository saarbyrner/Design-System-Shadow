// @flow
import $ from 'jquery';
import type { AthletesSelectorSquadData } from '@kitman/components/src/types';

const getEventSquads = (
  eventId: number
): Promise<{
  squads: Array<AthletesSelectorSquadData>,
  selected_athletes: Array<string | number>,
}> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/planning_hub/events/${eventId}/squads?include_availability=true&include_position_abbreviation=true`,
      timeout: 40000,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getEventSquads;
