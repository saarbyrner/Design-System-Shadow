/* eslint-disable camelcase */
// @flow
import { useState, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import type {
  GetAthleteIssuesServiceParams,
  AthleteIssues,
} from '@kitman/services/src/services/medical/getAthleteIssues';
import type { Issue } from '@kitman/modules/src/Medical/shared/types';
import { useGetAthleteIssuesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { IssueStatus } from '../types';

type ExcludeGroup = Array<IssueStatus>;

const useAthletesIssuesAsGroupedSelectOptions = (props: {
  athleteId: ?number,
  skipRequest?: boolean,
  serviceOptions?: GetAthleteIssuesServiceParams,
  excludeGroup?: ExcludeGroup,
}) => {
  const [athleteIssuesOptions, setAthleteIssuesOptions] = useState<
    Array<Option>
  >([]);

  const { data, isError, isLoading } = useGetAthleteIssuesQuery(
    {
      athleteId: props.athleteId,
      ...(props.serviceOptions || {}),
      grouped: true,
      ...(window.featureFlags['medical-fetch-shared-issues'] && {
        limitToCurrOrg: false,
      }),
    },
    {
      skip: props.skipRequest || false,
    }
  );

  const mapIssuesToOptions = (issues: ?Array<Issue>) =>
    issues?.map(
      ({
        id,
        full_pathology,
        issue_occurrence_title,
        issue_type,
        occurrence_date,
      }) => ({
        value: `${issue_type}_${id}`,
        label: getIssueTitle(
          {
            full_pathology,
            issue_occurrence_title,
            occurrence_date,
          },
          true
        ),
      })
    );

  useEffect(() => {
    const fetchedIssues: AthleteIssues = data;
    if (!props.athleteId || isLoading || isError || !fetchedIssues) {
      setAthleteIssuesOptions([]);
      return;
    }

    const issuesOptions = [];

    if (!props.excludeGroup?.includes('open')) {
      issuesOptions.push({
        label: i18n.t('Open injury/ illness'),
        options: mapIssuesToOptions(fetchedIssues.open_issues),
      });
    }

    if (
      !props.excludeGroup?.includes('prior') &&
      !props.excludeGroup?.includes('closed')
    ) {
      issuesOptions.push({
        label: i18n.t('Prior injury/illness'),
        options: mapIssuesToOptions(fetchedIssues.closed_issues),
      });
    }

    // NOTE: fetchedIssues does not include archived issues so no need to handle excludeGroup archived
    if (
      window.featureFlags['chronic-injury-illness'] &&
      !props.excludeGroup?.includes('chronic') &&
      fetchedIssues.chronic_issues
    ) {
      issuesOptions.push({
        label: i18n.t('Chronic Issues'),
        options: fetchedIssues.chronic_issues?.map(
          ({ id, full_pathology, pathology, title, reported_date }) => ({
            // NOTE: Chronic issues don't include an issue_type in the data.
            // TODO: Request issue_type be included from BE.

            // NOTE: Emr::Private::Models::ChronicIssue may be a better prefix than ChronicInjury
            // But utilities would need refactor to support it
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
    setAthleteIssuesOptions(issuesOptions);
  }, [data, isError, isLoading, props.athleteId, props.excludeGroup]);

  return {
    athleteIssuesOptions,
    isError,
    isLoading,
  };
};

export default useAthletesIssuesAsGroupedSelectOptions;
