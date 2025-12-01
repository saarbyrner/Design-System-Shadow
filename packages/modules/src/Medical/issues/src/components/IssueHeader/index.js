// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { saveIssue } from '@kitman/services';
import { AppStatus, LineLoader } from '@kitman/components';
import type { InjuryIllnessUpdate } from '@kitman/services/src/types';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import type { RequestStatus } from '../../../../shared/types';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import { HeaderDetailsTranslated as HeaderDetails } from './HeaderDetails';
import { EditViewTranslated as EditView } from './EditView';
import { HeaderTitleTranslated as HeaderTitle } from './HeaderTitle';

import type { ViewType } from '../../types';

export type Details = {
  squadId: ?number,
  newInjuryToRecurrentInjury: ?string,
};

const style = {
  section: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
    padding: '24px',
    position: 'relative',
  },
  sectionLoader: {
    bottom: 0,
    height: '4px',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
};

type Props = {
  athleteData: AthleteData,
  editActionDisabled?: boolean,
  onEnterEditMode: (section: ?string) => null,
};

const IssueHeader = (props: Props) => {
  const { issue, issueType, updateIssue } = useIssue();
  const { updateIssueTabRequestStatus } = useIssueTabRequestStatus();
  const { updateAthleteIssueType } = useAthletesIssues();
  const { trackEvent } = useEventTracking();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
  const [details, setDetails] = useState<Details>({
    squadId: issue?.squad?.id,
    newInjuryToRecurrentInjury: null,
  });
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] = useState(
    window.featureFlags['incomplete-injury-fields']
  );

  const fetchIssueOptions = () => {
    setRequestStatus('PENDING');
    setIsOptionsLoaded(true);
    setViewType('EDIT');
    setRequestStatus('SUCCESS');
  };

  const selectEditView = () => {
    if (isOptionsLoaded) {
      setViewType('EDIT');
      return;
    }

    fetchIssueOptions();
  };

  const selectDetail = (
    detailType: $Keys<Details>,
    detailValue: string | number | Array<number>
  ) => {
    setDetails((prevState) => ({
      ...prevState,
      [`${detailType}`]: detailValue,
    }));
  };

  const discardChanges = () => {
    if (!window.featureFlags['incomplete-injury-fields'])
      setIsValidationCheckAllowed(false);

    setViewType('PRESENTATION');
  };

  const saveEdit = () => {
    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');
    saveIssue(issueType, {
      ...issue,
      squad_id: details.squadId,
    })
      .then((updatedIssue) => {
        if (
          window.featureFlags['editable-injury-type'] &&
          details.newInjuryToRecurrentInjury
        ) {
          const updatedIssueType: InjuryIllnessUpdate = {
            from_issue_occurrence_id: issue.id,
            ...(details.newInjuryToRecurrentInjury ===
            'no_prior_injury_record_in_emr'
              ? { recurrence_outside_system: true }
              : {
                  to_issue_occurrence_id: parseInt(
                    details.newInjuryToRecurrentInjury.split('_')[1],
                    10
                  ),
                }),
            to_type: 'recurrence',
            issue_type: 'injury',
            athlete_id: issue.athlete_id,
          };
          updateAthleteIssueType(updatedIssueType);
        }
        setRequestStatus('SUCCESS');
        updateIssue(updatedIssue);
        discardChanges();
        updateIssueTabRequestStatus('DORMANT');
        trackEvent(
          performanceMedicineEventNames.editedInjuryIllnessInjuryDetails
        );
      })
      .finally(() => {
        props.onEnterEditMode();
        setRequestStatus(null);
        updateIssueTabRequestStatus(null);
      });
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <section css={style.section} data-testid="IssueHeader">
      {viewType === 'EDIT' && (
        <div>
          <HeaderTitle
            viewType={viewType}
            onSave={() => {
              saveEdit();
            }}
            onEdit={() => {
              selectEditView();
              props.onEnterEditMode();
            }}
            onDiscardChanges={() => {
              discardChanges();
              props.onEnterEditMode();
            }}
            isRequestPending={requestStatus === 'PENDING'}
          />
          <EditView
            occurrenceType={issue.occurrence_type}
            athleteData={props.athleteData}
            athleteId={issue.athlete_id}
            details={details}
            onSelectDetail={(detailType, detailValue) =>
              selectDetail(detailType, detailValue)
            }
            isValidationCheckAllowed={isValidationCheckAllowed}
          />
          <HeaderDetails viewType={viewType} />
        </div>
      )}
      {viewType === 'PRESENTATION' && (
        <>
          <HeaderTitle
            viewType={viewType}
            onSave={saveEdit}
            onEdit={() => {
              selectEditView();
              props.onEnterEditMode();
            }}
            onDiscardChanges={() => {
              discardChanges();
              props.onEnterEditMode();
            }}
            isRequestPending={requestStatus === 'PENDING'}
            editActionDisabled={props.editActionDisabled}
          />
          <HeaderDetails viewType={viewType} />
        </>
      )}
      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="IssueHeaderLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
};

export const IssueHeaderTranslated = withNamespaces()(IssueHeader);
export default IssueHeader;
