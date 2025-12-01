// @flow
import $ from 'jquery';
import type { AddDocuments } from '@kitman/modules/src/Medical/shared/types';
import type { FileRequestResponse } from '@kitman/modules/src/Medical/shared/types/medical';

const saveDocument = async (
  documents: AddDocuments
): Promise<FileRequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/medical/document_v2s/bulk_create',
      contentType: 'application/json',
      data: JSON.stringify(documents),
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default saveDocument;
