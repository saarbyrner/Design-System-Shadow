// @flow
import $ from 'jquery';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const archiveMedicalNote = (
  note: MedicalNote,
  reason: number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/medical/notes/${note.id}/archive`,
      contentType: 'application/json',
      data: JSON.stringify({
        archived: true,
        archive_reason_id: reason,
        annotationable_type: note.annotationable_type,
      }),
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default archiveMedicalNote;
