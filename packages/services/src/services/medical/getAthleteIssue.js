// @flow
import $ from 'jquery';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

type AthleteIssue = IssueOccurrenceRequested & {};

const getAthleteIssues = (
  athleteId: number,
  issueId: number,
  issueType: IssueType,
  isChronic: boolean = false
): Promise<AthleteIssue> => {
  return new Promise((resolve, reject) => {
    let url =
      issueType === 'Injury'
        ? `/athletes/${athleteId}/injuries/${issueId}`
        : `/athletes/${athleteId}/illnesses/${issueId}`;

    if (isChronic) {
      url = `/athletes/${athleteId}/chronic_issues/${issueId}`;
    }

    $.ajax({
      method: 'GET',
      url,
      data: {
        scope_to_org: true,
        detailed: true,
        include_occurrence_type: true,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteIssues;
