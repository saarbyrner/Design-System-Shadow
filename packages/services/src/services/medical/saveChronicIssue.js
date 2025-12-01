// @flow
import $ from 'jquery';

const saveChronicIssue = (
  athleteId: number | string,
  chronicIssueId: number | string,
  chronicIssueBody: {
    title?: string,
    chronic_occurrences: Array<{
      id: string,
      issue_type: string,
    }>,
  }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      contentType: 'application/json',
      url: `/athletes/${athleteId}/chronic_issues/${chronicIssueId}`,
      data: JSON.stringify(chronicIssueBody),
    })
      .done((data) => resolve(data))
      .fail(reject);
  });
};

export default saveChronicIssue;
