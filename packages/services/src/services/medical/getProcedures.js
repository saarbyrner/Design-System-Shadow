// @flow
import $ from 'jquery';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';
import type { ProceduresFilter } from '@kitman/modules/src/Medical/shared/types';

export type RequestResponse = {
  procedures: Array<ProcedureResponseData>,
  next_id?: number,
};

const getProcedures = (
  filters: ProceduresFilter,
  nextPage: ?number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/medical/procedures/search`,
      contentType: 'application/json',
      data: JSON.stringify({
        filters: {
          ...filters,
          location_ids: filters.procedure_location_ids,
        },
        next_id: nextPage,
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getProcedures;
