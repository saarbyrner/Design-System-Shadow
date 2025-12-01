// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Modal } from '@kitman/components';
import { Stack, Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import useCreateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateDisciplinaryIssue';
import useUpdateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateDisciplinaryIssue';
import useDeleteDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useDeleteDisciplinaryIssue';
import {
  getIsCreateModalOpen,
  getIsUpdateModalOpen,
  getIsDeleteModalOpen,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import {
  CREATE_DISCIPLINARY_ISSUE,
  UPDATE_DISCIPLINARY_ISSUE,
  DELETE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

function DisciplinaryIssueModal() {
  const {
    handleOnCreateDisciplinaryIssue,
    handleOnCancel: handleOnCreateCancel,
    modalText: createModalText,
    modalTitle: createModalTitle,
  } = useCreateDisciplinaryIssue();

  const {
    handleOnUpdateDisciplinaryIssue,
    handleOnCancel: handleOnUpdateCancel,
    modalText: updateModalText,
    modalTitle: updateModalTitle,
  } = useUpdateDisciplinaryIssue();

  const {
    handleOnDeleteDisciplinaryIssue,
    handleOnCancel: handleOnDeleteCancel,
    modalText: deleteModalText,
    modalTitle: deleteModalTitle,
  } = useDeleteDisciplinaryIssue();

  const isUpdateModalOpen = useSelector(getIsUpdateModalOpen);
  const isDeleteModalOpen = useSelector(getIsDeleteModalOpen);
  const isCreateModalOpen = useSelector(getIsCreateModalOpen);

  let isOpen: boolean = false;
  let handleOnSubmit: () => Promise<void>;
  let handleOnCancel: () => void;
  let modalText: () => React$Element<any> | string;
  let modalTitle: string;
  let ctaButtonText: string;

  const disciplineMode = useSelector(getDisciplinaryIssueMode);

  switch (disciplineMode) {
    case UPDATE_DISCIPLINARY_ISSUE:
      isOpen = isUpdateModalOpen;
      handleOnSubmit = handleOnUpdateDisciplinaryIssue;
      handleOnCancel = handleOnUpdateCancel;
      modalText = updateModalText;
      modalTitle = updateModalTitle;
      ctaButtonText = i18n.t('Suspend');
      break;
    case DELETE_DISCIPLINARY_ISSUE:
      isOpen = isDeleteModalOpen;
      handleOnSubmit = handleOnDeleteDisciplinaryIssue;
      handleOnCancel = handleOnDeleteCancel;
      modalText = deleteModalText;
      modalTitle = deleteModalTitle;
      ctaButtonText = i18n.t('Delete');
      break;
    case CREATE_DISCIPLINARY_ISSUE:
    default:
      isOpen = isCreateModalOpen;
      handleOnSubmit = handleOnCreateDisciplinaryIssue;
      handleOnCancel = handleOnCreateCancel;
      modalText = createModalText;
      modalTitle = createModalTitle;
      ctaButtonText = i18n.t('Suspend');
  }

  return (
    <Modal
      isOpen={isOpen}
      onPressEscape={handleOnCancel}
      close={handleOnCancel}
    >
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div>{modalText()}</div>
      </Modal.Content>
      <Modal.Footer>
        <Stack direction="row">
          <Button onClick={handleOnCancel} color="secondary">
            {i18n.t('Cancel')}
          </Button>
          <Button onClick={handleOnSubmit}>{ctaButtonText}</Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
}

export const DisciplinaryIssueModalTranslated = withNamespaces()(
  DisciplinaryIssueModal
);
export default DisciplinaryIssueModal;
