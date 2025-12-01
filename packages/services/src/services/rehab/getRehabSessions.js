// @flow
import $ from 'jquery';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import type { RehabSession } from '../../../../modules/src/Medical/shared/components/RehabTab/types';
import convertIssueType from './issueTypeHelper';

const getRehabSessions = (
  startDate: string,
  endDate: string,
  issueOccurrenceId: ?number,
  issueType: ?IssueType
): Promise<Array<RehabSession>> =>
  new Promise((resolve, reject) => {
    const requestData = {
      start_date: startDate,
      end_date: endDate,
      issue_type: convertIssueType(issueType),
      issue_id: issueOccurrenceId != null ? issueOccurrenceId : undefined,
    };

    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/sessions/search`,
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    })
      .done(resolve)
      .fail(reject);
  });

export default getRehabSessions;
