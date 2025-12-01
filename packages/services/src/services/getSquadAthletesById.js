// @flow
import $ from 'jquery';

const getSquadAthletes = (id: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/squad_athletes/${id}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSquadAthletes;
