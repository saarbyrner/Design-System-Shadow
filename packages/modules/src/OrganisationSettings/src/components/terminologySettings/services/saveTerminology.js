// @flow
import $ from 'jquery';
import type { CustomTerminology } from '@kitman/services/src/services/getTerminologies';

const saveTerminology = async (terminology: CustomTerminology) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/terminologies/${terminology.key}/save`,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ value: terminology.value }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default saveTerminology;
