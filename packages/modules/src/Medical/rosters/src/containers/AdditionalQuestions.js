// @flow
import { useDispatch, useSelector } from 'react-redux';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { AdditionalQuestionsTranslated as AdditionalQuestions } from '../components/AddIssueSidePanel/components/AdditionalQuestions';
import { addAdditionalAnnotation } from '../redux/actions';

type Props = {
  // Permissions
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  issueIsAContinuation: boolean,
  isInfoEvent: boolean,
  areAnnotationsInvalid: boolean,

  // these are passed up to parent to be passed to PanelActions.
  // logic ported from when this was in the parent addIssue sidepanel.
  attachedFiles: AttachedFile[],
  setAttachedFiles: Function,
  uploadQueuedAttachments: boolean,
  isPastAthlete: boolean,
  setAllowCreateIssue: Function,
};

export default (props: Props) => {
  const dispatch = useDispatch();
  const conditionalFieldsQuestions = useSelector(
    (state) => state.addIssuePanel.additionalInfo.questions
  );
  const selectedChronicOccurence = useSelector(
    (state) => state.addIssuePanel.additionalInfo.chronicOccurence
  );

  return (
    <AdditionalQuestions
      onAddAnnotation={(annotationType) => {
        dispatch(addAdditionalAnnotation(annotationType));
      }}
      onUpdateIssueFiles={props.setAttachedFiles}
      attachedFiles={props.attachedFiles}
      selectedChronicOccurence={selectedChronicOccurence}
      conditionalFieldsQuestions={conditionalFieldsQuestions}
      permissions={props.permissions}
      isPastAthlete={props.isPastAthlete}
      uploadQueuedAttachments={props.uploadQueuedAttachments}
      setAllowCreateIssue={props.setAllowCreateIssue}
      issueIsAContinuation={props.issueIsAContinuation}
      isInfoEvent={props.isInfoEvent}
      areAnnotationsInvalid={props.areAnnotationsInvalid}
    />
  );
};
