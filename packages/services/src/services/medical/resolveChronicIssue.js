// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';

export type Parameters = {
  athleteId: number,
  issueId: number,
  resolving: boolean,
  resolved_date: string,
};

const resolveChronicIssue = async (
  params: Parameters
): Promise<IssueOccurrenceRequested> => {
  const { data } = await axios.patch(
    `/athletes/${params.athleteId}/chronic_issues/${params.issueId}/toggle_resolve`,
    {
      resolving: params.resolving,
      ...(params.resolving && { resolved_date: params.resolved_date }),
    }
  );

  return data;
};

export default resolveChronicIssue;
