// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DocumentRequestResponse } from '@kitman/modules/src/Medical/shared/types/medical';

const archiveMedicalDocument = async (
  documentId: number,
  archiveReasonId: number
): Promise<DocumentRequestResponse> => {
  const { data } = await axios.patch(
    `/medical/document_v2s/${documentId}/archive`,
    {
      archive_reason_id: archiveReasonId,
    }
  );

  return data;
};

export default archiveMedicalDocument;
