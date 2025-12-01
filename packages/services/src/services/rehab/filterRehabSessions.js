// @flow
import $ from 'jquery';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import type { RehabSession } from '../../../../modules/src/Medical/shared/components/RehabTab/types';
import convertIssueType from './issueTypeHelper';

type IssueFilter = {
  issueOccurrenceId: number,
  issueType: IssueType,
};

const filterRehabSessions = (
  startDate: string,
  endDate: string,
  athleteId: number,
  issues: ?Array<IssueFilter>,
  maintenance: boolean
): Promise<Array<RehabSession>> =>
  new Promise((resolve, reject) => {
    const requestData = {
      athlete_id: athleteId,
      start_date: startDate,
      end_date: endDate,
      maintenance,
      issues: issues?.map((issue) => {
        return {
          issue_id: issue.issueOccurrenceId,
          issue_type: convertIssueType(issue.issueType),
        };
      }),
    };

    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/sessions/filter`,
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    })
      .done(resolve)
      .fail(reject);
  });

export default filterRehabSessions;
