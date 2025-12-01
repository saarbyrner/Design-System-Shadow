// @flow
import $ from 'jquery';
import type { ProceduresFormDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

type ArgumentFormDataType = {
  onlyDefaultLocations?: boolean,
};

const getProceduresFormData = (
  args: ArgumentFormDataType
): Promise<ProceduresFormDataResponse> => {
  const { onlyDefaultLocations } = args;

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      data: {
        ...(onlyDefaultLocations && {
          only_default_locations: onlyDefaultLocations,
        }),
      },
      url: '/ui/procedures/form_data',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getProceduresFormData;
