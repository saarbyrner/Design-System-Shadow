// @flow
import $ from 'jquery';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';

// retrieves single Procedure for current athlete
const getCurrentProcedure = (
  procedureId: number
): Promise<ProcedureResponseData> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      contentType: 'application/json',
      method: 'GET',
      url: `/medical/procedures/${procedureId}`,
      data: { from_api: true },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCurrentProcedure;
