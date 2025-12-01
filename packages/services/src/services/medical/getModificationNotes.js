// @flow
import $ from 'jquery';
import type { ModificationFilters } from '@kitman/modules/src/Medical/shared/types';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medical_notes: Array<MedicalNote>,
  total_count: number,
  meta: {
    next_page: number,
  },
};

const getModificationNotes = (
  filters: ModificationFilters,
  nextPage: ?number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/medical/modifications/search',
      contentType: 'application/json',
      data: JSON.stringify({
        ...filters,
        page: nextPage,
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getModificationNotes;
