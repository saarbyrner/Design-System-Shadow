// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useSelector } from 'react-redux';
import { getActiveDisciplinaryIssue } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { useUpdateDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { onReset } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import useDisciplineToasts from './useDisciplineToasts';
import useBaseDisciplinaryIssue from './useBaseDisciplinaryIssue';

const useUpdateDisciplinaryIssue = () => {
  const base = useBaseDisciplinaryIssue();
  const { onClearUpdateToasts, onUpdateSuccessToast, onUpdateFailureToast } =
    useDisciplineToasts();
  const [onUpdateDisciplinaryIssue] = useUpdateDisciplinaryIssueMutation();
  const activeDiscipline = useSelector(getActiveDisciplinaryIssue);

  const handleOnUpdateDisciplinaryIssue = async () => {
    const disciplineId = activeDiscipline?.id ?? null;
    if (!disciplineId) return;

    onClearUpdateToasts();
    const response = await onUpdateDisciplinaryIssue({
      ...base.issue,
      id: disciplineId,
    });
    if (response.error) {
      onUpdateFailureToast();
    } else {
      onUpdateSuccessToast();
    }
    base.dispatch(onReset());
  };

  return {
    handleOnUpdateDisciplinaryIssue,
    handleOnCancel: base.handleOnCancel,
    modalText: window.getFlag('league-ops-discipline-area-v2')
      ? base.modalContent
      : base.getModalText,
    modalTitle: i18n.t('Suspension edits'),
    isDisabled: window.getFlag('league-ops-discipline-area-v2')
      ? !base.formValidation
      : !base.isIssueFormComplete,
    mode: base.mode,
  };
};

export default useUpdateDisciplinaryIssue;
