/* eslint-disable camelcase */
// @flow
import { useState, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { getAthleteIssues } from '@kitman/services';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import type { SelectOption as Option } from '@kitman/components/src/types';

/**
 * useEnrichedAthletesIssues
 * @param  {?number} athleteId?
 * @param  {boolean=false} useOccurrenceId // True then use the injury occurrence id in the value of the resulting options
 * @param  {Function=null} issueFilter // Filter function to filter athlete issues
 */
export type EnrichedAthleteIssue = {
  label: string,
  options: Array<Option>,
};

type Props = {
  athleteId?: ?number,
  useOccurrenceId?: boolean,
  detailedIssue?: boolean,
  customIssueFilter?: ?Function,
  includeOccurrenceType?: boolean,
  includeIssueHook?: boolean,
  includeGroupedHook?: boolean,
};

const useEnrichedAthletesIssues = ({
  athleteId,
  useOccurrenceId = false,
  detailedIssue = false,
  customIssueFilter = null,
  includeOccurrenceType = false,
  includeIssueHook = true,
  includeGroupedHook = true,
}: Props) => {
  const [enrichedAthleteIssues, setEnrichedAthleteIssues] = useState<
    Array<EnrichedAthleteIssue>
  >([]);

  const fetchAthleteIssues = ({
    selectedAthleteId,
    useOccurrenceIdValue = false,
    includeDetailedIssue = false,
    issueFilter = null,
    includeIssue = true,
    includeGrouped = true,
  }: {
    selectedAthleteId: number,
    useOccurrenceIdValue: boolean,
    includeDetailedIssue: boolean,
    issueFilter: ?Function,
    includeIssue: boolean,
    includeGrouped: boolean,
  }): Promise<any> => {
    return new Promise<void>((resolve: (value: any) => void, reject) =>
      getAthleteIssues({
        athleteId: selectedAthleteId,
        grouped: includeGrouped,
        includeIssue,
        includeOccurrenceType,
        includeDetailedIssue,
        ...(window.featureFlags['medical-fetch-shared-issues'] && {
          limitToCurrOrg: false,
        }),
      }).then(
        (fetchedIssues) => {
          let openIssues = [];
          let closedIssues = [];
          let chronicIssues = [];

          if (includeGrouped) {
            openIssues = fetchedIssues.open_issues || [];
            closedIssues = fetchedIssues.closed_issues || [];
            chronicIssues = fetchedIssues.chronic_issues || [];
          } else {
            const allIssues = fetchedIssues.issues || [];
            openIssues = allIssues.filter((issue) => !issue.closed);
            closedIssues = allIssues.filter((issue) => issue.closed);
            // Note: Chronic issues are not included in the non-grouped response
          }

          if (issueFilter) {
            openIssues = openIssues.filter(issueFilter);
            closedIssues = closedIssues.filter(issueFilter);
          }

          const mapIssueToOption = (issue) => {
            const {
              id,
              issue: issueData,
              full_pathology: fullPathology,
              issue_occurrence_title: title,
              issue_type: type,
              occurrence_date: date,
            } = issue;
            const valueId = useOccurrenceIdValue ? id : issueData?.id;
            return {
              value: valueId ? `${type}_${valueId}` : undefined,
              label: getIssueTitle(
                {
                  full_pathology: fullPathology,
                  issue_occurrence_title: title,
                  occurrence_date: date,
                },
                true
              ),
            };
          };

          const issues = [
            {
              label: i18n.t('Open injury/ illness'),
              options: openIssues
                .map(mapIssueToOption)
                .filter((option) => option.value),
            },
            {
              label: i18n.t('Prior injury/illness'),
              options: closedIssues
                .map(mapIssueToOption)
                .filter((option) => option.value),
            },
          ];

          if (window.featureFlags['chronic-injury-illness']) {
            issues.push({
              label: i18n.t('Chronic Issues'),
              options: chronicIssues.map(
                ({ id, full_pathology, pathology, reported_date, title }) => ({
                  value: `ChronicInjury_${id}`,
                  label: getIssueTitle(
                    {
                      full_pathology: full_pathology || pathology,
                      issue_occurrence_title: title,
                      occurrence_date: reported_date || '', // empty string will be non truthy
                    },
                    true,
                    title
                  ),
                })
              ),
            });
          }
          setEnrichedAthleteIssues(issues);
          resolve();
        },
        () => reject()
      )
    );
  };

  useEffect(() => {
    if (!athleteId) {
      return;
    }

    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: useOccurrenceId,
      includeDetailedIssue: detailedIssue,
      issueFilter: customIssueFilter,
      includeIssue: includeIssueHook,
      includeGrouped: includeGroupedHook,
    });
  }, [
    athleteId,
    useOccurrenceId,
    detailedIssue,
    customIssueFilter,
    includeOccurrenceType,
    includeIssueHook,
    includeGroupedHook,
  ]);

  return {
    enrichedAthleteIssues,
    fetchAthleteIssues,
  };
};

export default useEnrichedAthletesIssues;
