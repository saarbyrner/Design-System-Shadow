// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  MetaIssue,
  Issue,
} from '@kitman/modules/src/Medical/shared/types';
import type { IssueType } from '@kitman/services/src/services/medical/getAthleteIssues';
import type { ChronicIssue } from '@kitman/services/src/services/medical/getAthleteChronicIssues';

export type AthleteIssues = {
  meta?: MetaIssue,
  issues?: Array<Issue>,
  open_issues?: Array<Issue>,
  closed_issues?: Array<Issue>,
  chronic_issues?: Array<ChronicIssue>,
  recurrence_outside_system: boolean,
  continuation_outside_system: boolean,
};

export const generateEndpointUrl = (athleteId: number) =>
  `/ui/medical/athletes/${athleteId}/issue_occurrences/continuation_grouped_issues`;

const getAthleteContinuationIssues = async ({
  athleteId,
  issueType,
}: {
  athleteId: number,
  issueType: IssueType,
}): Promise<AthleteIssues> => {
  const { data } = await axios.get(generateEndpointUrl(athleteId), {
    params: { issue_type: issueType },
  });

  return data;
};

export default getAthleteContinuationIssues;
