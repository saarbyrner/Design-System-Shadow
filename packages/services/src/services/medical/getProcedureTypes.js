// @flow
import $ from 'jquery';
import type { ProcedureType } from '@kitman/modules/src/Medical/shared/types/medical';

export type ProcedureTypes = Array<ProcedureType>;

const getProcedureTypes = (id: number): Promise<ProcedureTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/procedures/procedure_types',
      data: {
        location_id: id,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getProcedureTypes;
