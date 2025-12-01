// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useCreateDisciplinaryIssueMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { onReset } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import useDisciplineToasts from './useDisciplineToasts';
import useBaseDisciplinaryIssue from './useBaseDisciplinaryIssue';

const useCreateDisciplinaryIssue = () => {
  const base = useBaseDisciplinaryIssue();
  const { onClearCreateToasts, onCreateSuccessToast, onCreateFailureToast } =
    useDisciplineToasts();
  const [onCreateDisciplinaryIssue] = useCreateDisciplinaryIssueMutation();

  const handleOnCreateDisciplinaryIssue = async () => {
    onClearCreateToasts();
    const response = await onCreateDisciplinaryIssue(base.issue);
    if (response.error) {
      onCreateFailureToast();
    } else {
      onCreateSuccessToast();
    }
    base.dispatch(onReset());
  };

  return {
    handleOnCreateDisciplinaryIssue,
    handleOnCancel: base.handleOnCancel,
    modalText: window.getFlag('league-ops-discipline-area-v2')
      ? base.modalContent
      : base.getModalText,
    modalTitle: i18n.t('Suspend user?'),
    isDisabled: window.getFlag('league-ops-discipline-area-v2')
      ? !base.formValidation
      : !base.isIssueFormComplete,
    mode: base.mode,
  };
};

export default useCreateDisciplinaryIssue;
