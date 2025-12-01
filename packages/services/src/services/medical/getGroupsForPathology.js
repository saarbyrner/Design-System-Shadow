// @flow
import $ from 'jquery';

export type PathologyGroup = Array<string>;

const getGroupsForPathology = (
  pathologyCode: number | string,
  codingSystemId: number
): Promise<PathologyGroup> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/medical/group_identifiers/search?code=${pathologyCode}&coding_system_id=${codingSystemId}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getGroupsForPathology;
