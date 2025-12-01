// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';

const archiveProcedure = async (
  procedureId: number,
  archiveReasonId: number
): Promise<ProcedureResponseData> => {
  const { data } = await axios.patch(
    `/medical/procedures/${procedureId}/archive`,
    {
      archive_reason_id: archiveReasonId,
    }
  );

  return data;
};

export default archiveProcedure;
