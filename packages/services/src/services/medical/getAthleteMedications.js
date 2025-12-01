// @flow
import $ from 'jquery';

export type RequestResponse = {
  url: string,
};

const getAthleteMedications = (id: number): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/medical/drfirst/portal_url?athlete_id=${id}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteMedications;
