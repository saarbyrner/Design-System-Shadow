// @flow
import $ from 'jquery';

const deleteProcedureAttachment = (
  procedureId: number,
  attachmentId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/medical/procedures/${procedureId}/attachments/${attachmentId}`,
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default deleteProcedureAttachment;
