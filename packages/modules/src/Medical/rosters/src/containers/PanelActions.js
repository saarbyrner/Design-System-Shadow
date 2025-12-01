import { useSelector, useDispatch } from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { useEffect } from 'react';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { getIssueType } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { PanelActionsTranslated as PanelActions } from '../components/AddIssueSidePanel/PanelActions';
import { isChronicIssue } from '../../../shared/utils';
import {
  createChronicIssue,
  createIssue,
  goToNextPanelPage,
  goToPreviousPanelPage,
} from '../redux/actions';

export default (props) => {
  const { trackEvent } = useEventTracking();
  const { organisation } = useOrganisation();
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.addIssuePanel.page);
  const annotations = useSelector(
    (state) => state.addIssuePanel.additionalInfo.annotations
  );

  const selectedIssueType = useSelector(
    (state) => state.addIssuePanel.initialInfo.type
  );
  const createIssueRequestStatus = useSelector(
    (state) => state.addIssuePanel.requestStatus
  );
  const linkedChronicIssue = useSelector(
    (state) => state.addIssuePanel.initialInfo.linkedChronicIssue
  );
  const createdIssueResponse = useSelector(
    (state) => state.addIssuePanel.issueCreateResponse
  );
  // NFL Change - This workaround is required to link a chronic occurrence after creating an issue which triggers chronic issue API.
  useEffect(() => {
    const isChronicOccurrence =
      selectedIssueType === 'CHRONIC_INJURY_OCCURRENCE' &&
      linkedChronicIssue === 'NoPriorChronicRecorded';
    const isCreateIssueSuccess = createIssueRequestStatus === 'success';

    if (
      isChronicOccurrence &&
      isCreateIssueSuccess &&
      Object.keys(createdIssueResponse).length !== 0
    ) {
      dispatch(
        createChronicIssue(
          organisation.coding_system.id,
          organisation.coding_system.key
        )
      );
    }
  }, [selectedIssueType, createIssueRequestStatus]);

  const trackCreateEvent = (issueType) =>
    trackEvent(
      performanceMedicineEventNames.createdInjuryIllness,
      getIssueType(issueType)
    );

  const onCreate = (issueType) => {
    if (isChronicIssue(issueType)) {
      dispatch(
        createChronicIssue(
          organisation.coding_system.id,
          organisation.coding_system.key
        )
      );
    } else {
      dispatch(createIssue(trackCreateEvent));
    }
  };

  return (
    <PanelActions
      currentPage={currentPage}
      annotations={annotations}
      onClickBack={() => {
        dispatch(goToPreviousPanelPage());
      }}
      onClickCreateIssue={onCreate}
      onClickNext={() => {
        dispatch(goToNextPanelPage());
      }}
      {...props}
    />
  );
};
