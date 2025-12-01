// @flow
import $ from 'jquery';

export type RequestResponse = Array<string>;

const getSquadNames = async (): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/squads/age_groups',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSquadNames;
