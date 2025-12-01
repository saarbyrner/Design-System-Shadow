// @flow
import $ from 'jquery';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const archiveDiagnostic = (
  athleteId: number,
  diagnosticId: number,
  reason: number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/diagnostics/${diagnosticId}/archive`,
      contentType: 'application/json',
      data: JSON.stringify({
        archived: true,
        archive_reason_id: reason,
      }),
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default archiveDiagnostic;
