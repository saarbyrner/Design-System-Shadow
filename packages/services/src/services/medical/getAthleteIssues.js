// @flow
import $ from 'jquery';

import { type DateRange } from '@kitman/common/src/types';
import {
  type MetaIssue,
  type Issue,
  type IssueStatus,
} from '@kitman/modules/src/Medical/shared/types';
import { type ChronicIssue } from './getAthleteChronicIssues';

export type AthleteIssues = {
  meta?: MetaIssue,
  issues?: Array<Issue>,
  open_issues?: Array<Issue>,
  closed_issues?: Array<Issue>,
  chronic_issues?: Array<ChronicIssue>,
  recurrence_outside_system: boolean,
  continuation_outside_system: boolean,
};

export type IssueType = 'injury' | 'illness';

export type GetAthleteIssuesServiceParams = {
  athleteId: number,
  issueStatus?: IssueStatus,
  grouped?: boolean,
  search?: string,
  issueType?: ?IssueType,
  injuryStatusIds?: ?Array<number>,
  dateRange?: ?DateRange,
  issuesPage?: ?number,
  issuesPerPage?: number,
  includeIssue?: boolean,
  includeDetailedIssue?: boolean,
  includePreviousOrganisation?: boolean,
  limitToCurrOrg?: boolean,
  isReccurence?: boolean,
  includeOccurrenceType?: boolean,
  abortController?: { current: typeof undefined | null | (() => void) },
};

const getAthleteIssues = ({
  athleteId,
  issueStatus,
  grouped,
  search,
  issueType,
  injuryStatusIds,
  dateRange,
  issuesPage,
  issuesPerPage,
  includeIssue,
  includeDetailedIssue,
  includeOccurrenceType = true,
  includePreviousOrganisation,
  limitToCurrOrg,
  isReccurence,
  abortController,
}: GetAthleteIssuesServiceParams): Promise<AthleteIssues> => {
  const isClosed = issueStatus === 'closed';
  const isOpen = issueStatus === 'open';
  const isPermitted = window.featureFlags['nfl-player-movement-trade'];

  return new Promise((resolve, reject) => {
    if (!athleteId) {
      reject(new Error('Not valid athleteId'));
      return;
    }
    const url =
      isClosed && isPermitted && !isReccurence
        ? `/ui/medical/athletes/${athleteId}/issue_occurrences/prior`
        : `/ui/medical/athletes/${athleteId}/issue_occurrences`;

    const req = $.ajax({
      method: 'GET',
      url,
      data: {
        issue_status: issueStatus,
        grouped,
        search,
        issue_type: issueType,
        injury_status_ids: injuryStatusIds,
        occurrence_date_range: dateRange,
        page: issuesPage,
        per_page: issuesPerPage,
        include_issue: includeIssue || includeDetailedIssue,
        detailed: includeDetailedIssue,
        include_previous_organisation: includePreviousOrganisation,
        include_occurrence_type: includeOccurrenceType,
        limit_to_current_organisation: limitToCurrOrg,
        hide_player_left_club:
          window.featureFlags['hide-player-left-club'] &&
          (isOpen || isClosed) &&
          isPermitted,
      },
    });

    // eslint-disable-next-line no-param-reassign
    if (abortController) abortController.current = req.abort;

    req.done(resolve).fail(reject);
  });
};

export default getAthleteIssues;
