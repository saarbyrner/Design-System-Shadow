// @flow
import $ from 'jquery';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const deleteDiagnosticAttachment = (
  diagnosticId: number,
  attachmentId: number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/medical/diagnostics/${diagnosticId}/attachments/${attachmentId}`,
      contentType: 'application/json',
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default deleteDiagnosticAttachment;
