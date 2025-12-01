// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import type {
  IssueOccurrenceRequested,
  // ChronicIssueRequested,
} from '@kitman/common/src/types/Issues';
import { getAthleteIssue } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

import type { IssueType, RequestStatus } from '../../types';
import useIssueConditionalQuestions from '../../hooks/useIssueConditionalQuestions';
import useIssueConditionalQuestionsV2 from '../../hooks/useIssueConditionalQuestionsV2';

export type IssueContextType = {
  issue: IssueOccurrenceRequested,
  // TODO use below pattern, it throws up too many errors at the moment
  // We can assume saftey for now as the chronic value is only used by
  // IssueDetails, EventDetails & Chronic Occurrences
  // issue: IssueOccurrenceRequested | ChronicIssueRequested,
  issueType: IssueType,
  requestStatus: ?string,
  updateIssue: (_: IssueOccurrenceRequested) => void,
  isChronicIssue: boolean,
  isReadOnly: boolean,
  isContinuationIssue: boolean,
};

export const DEFAULT_CONTEXT_VALUE = {
  issue: {},
  issueType: 'Injury',
  requestStatus: 'PENDING',
  updateIssue: () => {},
  isChronicIssue: false,
  hasPlayerLeftOrganisation: false,
  isReadOnly: false,
  isContinuationIssue: false,
};

const IssueContext = createContext<IssueContextType>(DEFAULT_CONTEXT_VALUE);

type Props = {
  children: Node,
  athleteId: number,
  issueId: number,
  issueType: IssueType,
  isChronicIssue?: boolean,
  organisationId: number,
};

const IssueContextProvider = (props: Props) => {
  const [issue, setIssue] = useState<IssueOccurrenceRequested>({});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const { data: athleteData }: { data: AthleteData } = useGetAthleteDataQuery(
    props.athleteId,
    {
      skip: !props.athleteId,
    }
  );

  useEffect(() => {
    getAthleteIssue(
      props.athleteId,
      props.issueId,
      props.issueType,
      props.isChronicIssue
    ).then(
      (issueData) => {
        setIssue(issueData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, [
    props.athleteId,
    props.issueId,
    props.issueType,
    props.isChronicIssue,
    props.organisationId,
  ]);

  const updateIssue = (updatedIssue: IssueOccurrenceRequested) =>
    setIssue(updatedIssue);

  const { questions } = useIssueConditionalQuestions({
    ...issue,
    issueType: props.issueType,
    isChronicIssue: !!props.isChronicIssue,
  });

  const { conditions } = useIssueConditionalQuestionsV2({
    ...issue,
    issueType: props.issueType,
    isChronicIssue: !!props.isChronicIssue,
  });

  const issueValue = {
    issue: {
      ...issue,
      conditional_questions: questions,
      conditions_with_questions: conditions,
    },
    issueType: props.issueType,
    isChronicIssue: !!props.isChronicIssue,
    isContinuationIssue: !!issue.continuation_issue,
    requestStatus,
    updateIssue,
    isReadOnly:
      (window.featureFlags['nfl-player-movement-trade'] &&
        (issue?.constraints?.read_only ||
          athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE')) ||
      false,
  };

  return (
    <IssueContext.Provider value={issueValue}>
      {props.children}
    </IssueContext.Provider>
  );
};

const useIssue = (): IssueContextType => useContext(IssueContext);

export { IssueContextProvider, useIssue };

export default IssueContext;
