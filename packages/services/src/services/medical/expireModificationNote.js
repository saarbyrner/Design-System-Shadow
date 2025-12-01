// @flow
import moment from 'moment';
import $ from 'jquery';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

const expireModificationNote = (id: number): Promise<MedicalNote> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/medical/modifications/${id}/expire`,
      contentType: 'application/json',
      data: JSON.stringify({ expiration_date: moment(), scope_to_org: true }),
    })
      .done(resolve)
      .fail(reject);
  });

export default expireModificationNote;
