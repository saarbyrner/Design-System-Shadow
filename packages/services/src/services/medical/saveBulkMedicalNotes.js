// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  BulkNoteAnnotationForm,
  Attachment,
} from '@kitman/modules/src/Medical/shared/types';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medical_notes: Array<MedicalNote>,
  attachments: Array<Attachment>,
  total_count: number,
  meta: {
    next_page: number,
  },
};

const saveBulkMedicalNotes = async (
  payload: BulkNoteAnnotationForm
): Promise<RequestResponse> => {
  const { data } = await axios.post('/medical/notes/create_bulk', payload);

  return data;
};

export default saveBulkMedicalNotes;
