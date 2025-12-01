// @flow
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import type { AthleteIssues } from '@kitman/modules/src/Medical/shared/types/medical';

export const mapIssuesToSelect = (issues: AthleteIssues) => {
  const issuesToMap = [];

  issues.open_issues?.forEach(
    ({
      issue,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: occurrenceDate,
    }) => {
      issuesToMap.push({
        value: issue && `${type}_${issue.id}`,
        label: `${getIssueTitle(
          {
            full_pathology: fullPathology,
            issue_occurrence_title: title,
            occurrence_date: occurrenceDate,
          },
          true
        )}`,
      });
    }
  );

  issues.closed_issues?.forEach(
    ({
      issue,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: occurrenceDate,
    }) => {
      issuesToMap.push({
        value: issue && `${type}_${issue.id}`,
        label: `${getIssueTitle(
          {
            full_pathology: fullPathology,
            issue_occurrence_title: title,
            occurrence_date: occurrenceDate,
          },
          true
        )}`,
      });
    }
  );

  return issuesToMap;
};
