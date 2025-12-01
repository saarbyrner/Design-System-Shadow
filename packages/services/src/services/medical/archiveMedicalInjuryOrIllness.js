// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AxiosResponse } from 'axios';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';

const archiveMedicalInjuryOrIllness = async (
  athleteId: number,
  issueId: number,
  issueType: IssueType,
  archiveReasonId: number
): Promise<AxiosResponse> => {
  const issueTypePath = getIssueTypePath(issueType);

  return axios.patch(
    `/athletes/${athleteId}/${issueTypePath}/${issueId}/archive`,
    {
      archive_reason_id: archiveReasonId,
    }
  );
};

export default archiveMedicalInjuryOrIllness;
