// @flow
import $ from 'jquery';

const deleteDocument = (documentId: number): Promise<any> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/documents/${documentId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
    })
      .done(resolve)
      .fail(reject);
  });

export default deleteDocument;
