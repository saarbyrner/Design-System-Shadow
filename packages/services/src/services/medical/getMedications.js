// @flow
import $ from 'jquery';

type RequestResponse = {
  url: string,
};

const getMedications = (id: number): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/medical/drfirst/download_medications`,
      data: {
        athlete_id: id,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getMedications;
