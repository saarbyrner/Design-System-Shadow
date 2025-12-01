// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { AthleteOpenIssues } from '@kitman/modules/src/Medical/rosters/types';

const getOpenIssuesForAthleteByDate = (
  athleteId: string,
  issueDate: string
): Promise<AthleteOpenIssues> => {
  return axios
    .get(`/athletes/${athleteId}/issues/open_issues_on_date`, {
      params: { report_date: issueDate },
    })
    .then((response) => response.data);
};
export default getOpenIssuesForAthleteByDate;
