// @flow
import $ from 'jquery';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportMultiDocument = ({
  attachmentIds,
}: {
  attachmentIds: Array<number>,
}): Promise<ExportsItem> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/export_jobs/multi_document',
      data: {
        attachment_ids: attachmentIds,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default exportMultiDocument;
