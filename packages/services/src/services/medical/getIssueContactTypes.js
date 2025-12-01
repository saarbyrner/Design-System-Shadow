// @flow
import $ from 'jquery';

export type IssueContactType = {
  name: string,
  id: number,
  require_additional_input: boolean,
  parent_id: number | null,
};

export type IssueContactTypes = Array<IssueContactType>;

const getIssueContactTypes = (): Promise<IssueContactTypes> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/issue_contact_types',
    })
      .done(resolve)
      .fail(reject);
  });

export default getIssueContactTypes;
