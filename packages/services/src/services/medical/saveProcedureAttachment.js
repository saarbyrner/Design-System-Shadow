// @flow
import $ from 'jquery';
import type { ProcedureAttachmentResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

const saveProcedureAttachment = (
  athleteId: number,
  procedureId: number,
  attachments: Array<AttachedTransformedFile>
): Promise<ProcedureAttachmentResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/medical/procedures/${procedureId}/attach`,
      contentType: 'application/json',
      data: JSON.stringify({
        attachments_attributes: attachments,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveProcedureAttachment;
