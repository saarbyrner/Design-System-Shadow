// @flow
import $ from 'jquery';

const getIssueInformation = (): Promise<{
  open_issue_count: { open: number, total: number },
}> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/rosters/issue_information',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getIssueInformation;
