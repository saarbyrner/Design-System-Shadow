/* eslint-disable max-statements */
// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Stack, Button } from '@kitman/playbook/components';
import useCreateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateDisciplinaryIssue';
import useUpdateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateDisciplinaryIssue';
import {
  onTogglePanel,
  onToggleModal,
  onSetDisciplineProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  getUserToBeDisciplined,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { UPDATE_DISCIPLINARY_ISSUE } from '@kitman/modules/src/LeagueOperations/shared/consts';

const Actions = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const mode = useSelector(getDisciplinaryIssueMode);
  const isUpdateMode = mode === UPDATE_DISCIPLINARY_ISSUE;

  const { isDisabled: isCreateDisabled, handleOnCancel: handleOnCreateCancel } =
    useCreateDisciplinaryIssue();
  const { isDisabled: isUpdateDisabled, handleOnCancel: handleOnUpdateCancel } =
    useUpdateDisciplinaryIssue();
  // Selected from the user dropdown in the discipline panel
  const selectedUser = useSelector(getUserToBeDisciplined);

  const handleOnCancel = isUpdateMode
    ? handleOnUpdateCancel
    : handleOnCreateCancel;
  const isDisabled = isUpdateMode ? isUpdateDisabled : isCreateDisabled;

  const handleOnSave = () => {
    if (selectedUser) {
      dispatch(
        onSetDisciplineProfile({
          profile: selectedUser,
        })
      );
    }
    dispatch(
      onTogglePanel({
        isOpen: false,
        mode,
      })
    );
    dispatch(onToggleModal({ isOpen: true }));
  };

  const renderApprovalActions = (): Node => {
    return (
      <Stack direction="row" gap={2}>
        <Button onClick={handleOnCancel} color="secondary">
          {props.t('Cancel')}
        </Button>
        <Button onClick={handleOnSave} disabled={isDisabled}>
          {props.t('Save')}
        </Button>
      </Stack>
    );
  };

  return renderApprovalActions();
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
