// @flow
import { useEffect } from 'react';
import moment from 'moment';
import type { Dispatch } from '@kitman/common/src/types';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';
import type { FormAction } from './useDiagnosticForm';

type Params = {
  isOpen: boolean,
  isEditing: boolean,
  organisationStatus?: ?string,
  issue: IssueOccurrenceRequested,
  issueType: IssueType,
  isChronicIssue: boolean,
  dateTransferFormat: string,
  dispatch: Dispatch<FormAction>,
};

const usePreloadIssueAndDatesEffect = ({
  isOpen,
  isEditing,
  organisationStatus,
  issue,
  issueType,
  isChronicIssue,
  dateTransferFormat,
  dispatch,
}: Params) => {
  useEffect(() => {
    if (isOpen && !isEditing && organisationStatus === 'CURRENT_ATHLETE') {
      dispatch({
        type: 'SET_MULTI_ORDER_DATE',
        index: 0,
        orderDate: moment().startOf('day').format(dateTransferFormat),
      });
      dispatch({
        type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
        index: 0,
        diagnosticDate: moment().startOf('day').format(dateTransferFormat),
      });
      return;
    }

    if (isOpen && issue && issueType) {
      const issueId = isChronicIssue ? issue.id : issue.issue_id;
      if (issueId) {
        const issueIds = [issueId];
        if (isChronicIssue) {
          dispatch({ type: 'SET_CHRONIC_IDS', chronicIssueIds: issueIds });
        } else if (issueType === 'Injury') {
          dispatch({ type: 'SET_INJURY_IDS', injuryIds: issueIds });
        } else if (issueType === 'Illness') {
          dispatch({ type: 'SET_ILLNESS_IDS', illnessIds: issueIds });
        }
      }
    }
  }, [isOpen, isEditing, organisationStatus, issue, issueType, isChronicIssue]);
};

export default usePreloadIssueAndDatesEffect;
