/* eslint-disable camelcase */
// @flow
import { useState, useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import {
  getAthleteIssues,
  updateAthleteIssueType as setAthleteIssueType,
} from '@kitman/services';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  getIssueTitle,
  mapIssuesToOptions,
  mapIssuesToSelectOptions,
} from '@kitman/modules/src/Medical/shared/utils';

// Types
import type { Option } from '@kitman/playbook/types';
import type { RequestStatus } from '@kitman/common/src/types';
import type { InjuryIllnessUpdate } from '@kitman/services/src/types';
import type { SelectOption } from '@kitman/components/src/types';
import type { IssueStatus } from '@kitman/modules/src/Medical/shared/types';

type ExcludeGroup = Array<IssueStatus>;

const useAthletesIssues = (
  athleteId?: ?number,
  excludeGroup?: ExcludeGroup,
  generateIssueOptions?: boolean
) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [athleteIssues, setAthleteIssues] = useState<Array<SelectOption>>([]);
  const [issueOptions, setIssueOptions] = useState<Array<Option>>([]);

  const locationAssign = useLocationAssign();

  const fetchAthleteIssues = (selectedAthleteId: number): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      setRequestStatus('PENDING');
      return getAthleteIssues({
        athleteId: selectedAthleteId,
        grouped: true,
        ...(window.featureFlags['medical-fetch-shared-issues'] && {
          limitToCurrOrg: false,
        }),
      }).then(
        (fetchedIssues) => {
          const issues: Array<SelectOption> = [];
          const options: Array<Array<Option>> = [];
          if (!excludeGroup?.includes('open')) {
            const group = i18n.t('Open injury/ illness');
            if (generateIssueOptions) {
              if (fetchedIssues.open_issues) {
                options.push(
                  mapIssuesToOptions(fetchedIssues.open_issues, group)
                );
              }
            } else {
              issues.push({
                label: group,
                options: fetchedIssues.open_issues
                  ? mapIssuesToSelectOptions(fetchedIssues.open_issues)
                  : undefined,
              });
            }
          }

          if (!excludeGroup?.includes('prior')) {
            const group = i18n.t('Prior injury/illness');
            if (generateIssueOptions) {
              if (fetchedIssues.closed_issues) {
                options.push(
                  mapIssuesToOptions(fetchedIssues.closed_issues, group)
                );
              }
            } else {
              issues.push({
                label: group,
                options: fetchedIssues.closed_issues
                  ? mapIssuesToSelectOptions(fetchedIssues.closed_issues)
                  : undefined,
              });
            }
          }

          if (
            window.featureFlags['chronic-injury-illness'] &&
            !excludeGroup?.includes('chronic')
          ) {
            const group = i18n.t('Chronic conditions');
            if (generateIssueOptions) {
              const mapped = fetchedIssues.chronic_issues?.map(
                ({ id, full_pathology, pathology, title, reported_date }) => ({
                  id,
                  label: getIssueTitle(
                    {
                      full_pathology: full_pathology || pathology,
                      issue_occurrence_title: title,
                      occurrence_date: reported_date || '', // empty string will be non truthy
                    },
                    true,
                    title
                  ),
                  type: 'ChronicInjury',
                  group,
                })
              );
              if (mapped) {
                options.push(mapped);
              }
            } else {
              issues.push({
                label: group,
                options: fetchedIssues.chronic_issues?.map(
                  ({
                    id,
                    full_pathology,
                    pathology,
                    title,
                    reported_date,
                  }) => ({
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
          }

          setRequestStatus('SUCCESS');
          if (generateIssueOptions) {
            setIssueOptions(options.flat());
          } else {
            setAthleteIssues(issues);
          }
          resolve();
        },
        () => {
          setRequestStatus('FAILURE');
          reject();
        }
      );
    });

  const updateAthleteIssueType = (issueTypeToUpdate: InjuryIllnessUpdate) => {
    const hasValidData =
      !!issueTypeToUpdate.athlete_id &&
      !!issueTypeToUpdate.from_issue_occurrence_id &&
      (!!issueTypeToUpdate.to_issue_occurrence_id ||
        !!issueTypeToUpdate.recurrence_outside_system);

    if (!hasValidData) {
      console.error(
        'Invalid data for updating athlete issue type',
        issueTypeToUpdate
      );
      return;
    }

    setAthleteIssueType(issueTypeToUpdate)
      .then((updatedIssue) => {
        if (issueTypeToUpdate.issue_type === 'injury') {
          const redirectUrl = `/medical/athletes/${issueTypeToUpdate.athlete_id}/injuries/${updatedIssue.id}`;

          if (issueTypeToUpdate.recurrence_outside_system) {
            /*
            when passing recurrence_outside_system = true, it will return the same id so the
            redirect won't fire so we need to do a full redirect for the change to take effect
          */
            window.location.reload();
          } else {
            // redirect to the updated injury
            locationAssign(redirectUrl);
          }
        }
      })
      .catch((err) => {
        console.error('Error updating issue type', err);
      });
  };

  useEffect(() => {
    if (!athleteId) {
      return;
    }

    fetchAthleteIssues(athleteId);
  }, [athleteId]);

  return {
    athleteIssues,
    requestStatus,
    fetchAthleteIssues,
    updateAthleteIssueType,
    issueOptions,
  };
};

export default useAthletesIssues;
