// @flow
import $ from 'jquery';
import type { DocumentsResponse } from '@kitman/common/src/types/Document';

const getDocuments = (): Promise<DocumentsResponse> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/initial_data_documents',
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });

export default getDocuments;
