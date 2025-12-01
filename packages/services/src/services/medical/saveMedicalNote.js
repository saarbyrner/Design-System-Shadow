// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  AnnotationForm,
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

const saveMedicalNote = async (
  annotation: AnnotationForm
): Promise<RequestResponse> => {
  const { data } = await axios.post('/medical/notes', annotation);

  return data;
};

export default saveMedicalNote;
