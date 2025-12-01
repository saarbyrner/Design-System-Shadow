/* eslint-disable max-statements */
// @flow
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import type { DisciplinaryIssueMode } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import {
  getDisciplinaryIssueMode,
  getCurrentDisciplinaryIssue,
  getDisciplineProfile,
  getActiveDisciplinaryIssue,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { onReset } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { useDeleteDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import useDisciplineToasts from './useDisciplineToasts';

type ReturnType = {
  handleOnDeleteDisciplinaryIssue: () => Promise<void>,
  handleOnCancel: () => void,
  modalText: () => string,
  modalTitle: string,
  isDisabled: boolean,
  mode: DisciplinaryIssueMode,
};

const useDeleteDisciplinaryIssue = (): ReturnType => {
  const dispatch = useDispatch();
  const { onDeleteSuccessToast, onDeleteFailureToast, onClearDeleteToasts } =
    useDisciplineToasts();

  const mode = useSelector(getDisciplinaryIssueMode);
  const issue = useSelector(getCurrentDisciplinaryIssue);
  const activeDiscipline = useSelector(getActiveDisciplinaryIssue);
  const profile = useSelector(getDisciplineProfile);

  const modalTitle = i18n.t('Delete current suspension');
  const modalText = (): string => {
    if (issue && profile) {
      return i18n.t(
        'The current suspension against {{name}} will be deleted and not counted towards the total number of suspensions for this user.',
        {
          name: profile.name,
        }
      );
    }
    return '';
  };

  const [onDeleteDisciplinaryIssue] = useDeleteDisciplinaryIssueMutation();

  const isDisabled: boolean = !issue || !profile;

  const handleOnDeleteDisciplinaryIssue = async () => {
    const disciplineId = activeDiscipline?.id ?? null;
    if (!disciplineId) {
      return;
    }
    onClearDeleteToasts();
    const response = await onDeleteDisciplinaryIssue({ id: disciplineId });
    if (response.error) {
      onDeleteFailureToast();
    } else {
      onDeleteSuccessToast();
    }
    dispatch(onReset());
  };

  const handleOnCancel = () => {
    dispatch(onReset());
  };

  return {
    handleOnDeleteDisciplinaryIssue,
    handleOnCancel,
    modalText,
    modalTitle,
    isDisabled,
    mode,
  };
};

export default useDeleteDisciplinaryIssue;
