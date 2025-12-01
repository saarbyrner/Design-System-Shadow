// @flow
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RequestStatus } from '@kitman/common/src/types';
import type { ChronicIssues } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { getAthleteChronicIssues } from '@kitman/services';

const useChronicIssues = (athleteId: number) => {
  const addIssuePanelState = useSelector((state) => state.addIssuePanel || {});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteChronicIssues, setAthleteChronicIssues] =
    useState<ChronicIssues>([]);
  const [athleteClosedChronicIssues, setAthleteClosedChronicIssues] =
    useState<ChronicIssues>([]);

  useEffect(() => {
    if (athleteId !== null || addIssuePanelState.requestStatus === 'success') {
      setRequestStatus('PENDING');
      getAthleteChronicIssues({
        athleteId,
        ...(window.featureFlags['chronic-conditions-resolution'] && {
          groupedResponse: true,
        }),
      }).then(
        (issues) => {
          setRequestStatus('SUCCESS');
          if (window.featureFlags['chronic-conditions-resolution']) {
            // $FlowFixMe Flow(prop-missing) active_chronic_issues will always exist when grouped is true
            setAthleteChronicIssues(issues.active_chronic_issues);
            setAthleteClosedChronicIssues(
              // $FlowFixMe Flow(prop-missing) resolved_chronic_issues will always exist when grouped is true
              issues.resolved_chronic_issues
            );
          } else {
            // $FlowFixMe Flow(incompatible-call) fetchedIssues will be of type ChronicIssues
            setAthleteChronicIssues(issues);
          }
        },
        (error) => {
          console.log(error);
          setRequestStatus('FAILURE');
        }
      );
    }
  }, [addIssuePanelState.requestStatus, athleteId]);

  return { athleteChronicIssues, athleteClosedChronicIssues, requestStatus };
};

export default useChronicIssues;
