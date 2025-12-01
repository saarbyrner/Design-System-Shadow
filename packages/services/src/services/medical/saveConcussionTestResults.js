// @flow
import $ from 'jquery';
import type { ConcussionTestProtocol } from '@kitman/modules/src/Medical/shared/types';

const saveConcussionTestResults = (
  testProtocol: ConcussionTestProtocol,
  testResults: Object
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url:
        testProtocol === 'KING-DEVICK'
          ? `/concussion/king_devick`
          : `/concussion/npc`,
      data: JSON.stringify(testResults),
    })
      .done((data) => resolve(data))
      .fail(reject);
  });
};

export default saveConcussionTestResults;
