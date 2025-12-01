// @flow
import $ from 'jquery';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const archiveMedication = (
  medicationId: number,
  reason: number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/ui/medical/medications/${medicationId}/archive`,
      contentType: 'application/json',
      data: JSON.stringify({
        archive_reason_id: reason,
      }),
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default archiveMedication;
