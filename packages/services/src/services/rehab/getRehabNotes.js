// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Annotation } from '../../../../common/src/types/Annotation';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import convertIssueType from './issueTypeHelper';

type IssueFilter = {
  issueOccurrenceId: number,
  issueType: IssueType,
};

const getRehabNotes = async (
  athleteId: number,
  startDate: string,
  endDate: string,
  isMaintenance: boolean,
  issues: Array<IssueFilter>
): Promise<Array<Annotation>> => {
  const { data } = await axios.post(`/ui/medical/rehab/sessions/annotations`, {
    athlete_id: athleteId,
    start_date: startDate,
    end_date: endDate,
    maintenance: isMaintenance,
    issues: issues.map((issue) => ({
      issue_type: convertIssueType(issue.issueType),
      issue_id: issue.issueOccurrenceId,
    })),
  });

  return data;
};

export default getRehabNotes;
