// @flow
import $ from 'jquery';
import type { ImportsResponse } from '@kitman/common/src/types/Imports';

export type ImportFilters = {
  import_type: ?string,
  status: ?string,
};

const importMassAthletes = ({
  nextPage,
  itemsPerPage,
  filters,
}: {
  // Passing nextPage and itemsPerPage as null/undefined will disable pagination
  nextPage: ?number,
  itemsPerPage: ?number,
  filters?: ImportFilters,
}): Promise<ImportsResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/import_jobs',
      data: {
        page: nextPage,
        per_page: itemsPerPage,
        import_type: filters?.import_type,
        status: filters?.status,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default importMassAthletes;
