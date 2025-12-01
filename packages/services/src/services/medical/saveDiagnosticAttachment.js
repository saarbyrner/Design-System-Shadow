// @flow
import $ from 'jquery';

const saveDiagnosticAttachment = (
  athleteId: number,
  diagnosticId: number,
  attachmentIds: Array<number>
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      // $FlowFixMe diagnosticId cannot be null here as validation will have caught it
      url: `/medical/diagnostics/${diagnosticId}/attach`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        attachment_ids: attachmentIds,
        athlete_id: athleteId,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveDiagnosticAttachment;
