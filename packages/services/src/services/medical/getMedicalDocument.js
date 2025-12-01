// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DocumentRequestResponse } from '@kitman/modules/src/Medical/shared/types/medical';

const getMedicalDocument = async (
  documentId: number
): Promise<DocumentRequestResponse> => {
  const { data } = await axios.get(`/medical/document_v2s/${documentId}`);

  return data;
};

export default getMedicalDocument;
