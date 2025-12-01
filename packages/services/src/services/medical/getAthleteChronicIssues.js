// @flow
import $ from 'jquery';

export type ChronicIssue = {
  id: number | string,
  title: string,
  pathology: string,
  full_pathology: string,
  reported_date?: string,
  occurrence_date?: string,
  resolved_date?: string,
};
export type ChronicIssues = Array<ChronicIssue>;
export type ChronicIssuesGrouped = {
  active_chronic_issues: ChronicIssues,
  resolved_chronic_issues: ChronicIssues,
};
type RequestConfig = {
  athleteId: number | string,
  groupedResponse?: boolean,
  abortController?: { current: typeof undefined | null | (() => void) },
};

const getAthleteChronicIssues = ({
  athleteId,
  groupedResponse,
  abortController,
}: RequestConfig): Promise<ChronicIssues | ChronicIssuesGrouped> => {
  return new Promise((resolve, reject) => {
    const req = $.ajax({
      method: 'GET',
      url: `/athletes/${athleteId}/chronic_issues/search${
        groupedResponse ? '?grouped_response=true' : ''
      }`,
    });

    // eslint-disable-next-line no-param-reassign
    if (abortController) abortController.current = req.abort;

    req.done(resolve).fail(reject);
  });
};

export default getAthleteChronicIssues;
