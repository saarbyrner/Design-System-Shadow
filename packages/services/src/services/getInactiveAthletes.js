// @flow
import $ from 'jquery';

const getInactiveAthletes = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/squad_athletes/athlete_list',
      contentType: 'application/json',
      data: {
        inactive: true,
        include_previous_organisation_information: true,
        include_organisation_transfer_records: true,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getInactiveAthletes;
