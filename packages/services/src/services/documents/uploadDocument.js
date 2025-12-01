// @flow
import $ from 'jquery';
import type { DocumentResponse } from '@kitman/common/src/types/Document';

const uploadDocument = (formData: FormData): Promise<DocumentResponse> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      enctype: 'multipart/form-data',
      url: `/documents`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(resolve)
      .fail(reject);
  });

export default uploadDocument;
