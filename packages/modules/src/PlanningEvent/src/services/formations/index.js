// @flow
import $ from 'jquery';

export type Formation = {
  id: number,
  number_of_players: number,
  name: string,
};

export const getFormations = (): Promise<Array<Formation>> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/formations',
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
