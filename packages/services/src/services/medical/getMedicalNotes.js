// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NotesFilters } from '@kitman/modules/src/Medical/shared/types';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medical_notes: Array<MedicalNote>,
  total_count: number,
  meta: {
    next_page: number,
  },
};

const getMedicalNotes = async (
  filters: NotesFilters,
  nextPage: ?number
): Promise<RequestResponse> => {
  const { data } = await axios.post('/medical/notes/search', {
    ...filters,
    page: nextPage,
  });

  return data;
};

export default getMedicalNotes;
