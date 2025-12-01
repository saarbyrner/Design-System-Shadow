// @flow
import $ from 'jquery';
import type { ExportsResponse } from '@kitman/common/src/types/Exports';

const getExportBilling = ({
  nextPage,
  itemsPerPage,
  exportType = null,
  status = null,
  isAthleteExport = false,
}: {
  nextPage: number,
  itemsPerPage: number,
  exportType?: ?string,
  status?: ?string,
  isAthleteExport: ?boolean,
}): Promise<ExportsResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: isAthleteExport ? '/athlete_export_jobs' : '/export_jobs',
      data: {
        page: nextPage,
        per_page: itemsPerPage,
        export_type: exportType,
        status,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getExportBilling;
