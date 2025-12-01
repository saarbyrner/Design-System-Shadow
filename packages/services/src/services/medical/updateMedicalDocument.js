// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { UpdateDocument } from '@kitman/modules/src/Medical/shared/types';
import type { DocumentRequestResponse } from '@kitman/modules/src/Medical/shared/types/medical';

const updateMedicalDocument = async (
  documentId: number,
  document: UpdateDocument
): Promise<DocumentRequestResponse> => {
  const { data } = await axios.patch(`/medical/document_v2s/${documentId}`, {
    document,
  });

  return data;
};

export default updateMedicalDocument;
