// @flow
import { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFormAnswersFactory,
  getOriginalFormFactory,
  getModeFactory,
  getFormStructureElements,
  getShowUnsavedChangesModalFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  onSetMode,
  onRestoreForm,
  onUpdateShowUnsavedChangesModal,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { onRestoreFormAttachments } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { onBuildValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { alertUser } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/helpers';

export type ReturnType = {
  hasUnsavedChanges: boolean,
  showModal: boolean,
  setNavigateBack: Function,
  handleCloseModal: Function,
  handleDiscardChanges: Function,
  handleBack: Function,
  discardChangesAndHandleBack: Function,
};

const useUnsavedChanges = (): ReturnType => {
  const dispatch = useDispatch();
  const historyGo = useHistoryGo();
  const showModal = useSelector(getShowUnsavedChangesModalFactory());
  const [navigateBack, setNavigateBack] = useState<boolean>(false);
  const originalFormValues = useSelector(getOriginalFormFactory());
  const actualFormValues = useSelector(getFormAnswersFactory());
  const mode = useSelector(getModeFactory());
  const formStructureElements = useSelector(getFormStructureElements());

  const handleCloseModal = useCallback(() => {
    dispatch(
      onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: false })
    );
  }, [dispatch]);

  const restoreForm = () => {
    dispatch(onRestoreForm({ originalForm: originalFormValues }));
    dispatch(onRestoreFormAttachments());
    dispatch(
      onBuildValidationState({
        elements: formStructureElements,
      })
    );
    dispatch(
      onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: false })
    );
  };

  const handleDiscardChanges = useCallback(() => {
    if (navigateBack) {
      // If the users have clicked the back button on the header, they
      // will be redirected back to the manage profile page or the athlete page depending
      // on which they navigated to athlete profile from.

      restoreForm();
      historyGo(-1);
    } else {
      // If the users have clicked the cancel button which is next to the save button (upper right)
      // then they would just go back to the VIEW mode of the page with the original form restored (without changes)

      restoreForm();
      if (mode !== MODES.CREATE) {
        dispatch(onSetMode({ mode: MODES.VIEW }));
      }
    }
  }, [
    dispatch,
    historyGo,
    mode,
    navigateBack,
    originalFormValues,
    formStructureElements,
  ]);

  const areEqual = (a, b) =>
    a?.length === b?.length &&
    a.every((element, index) => element === b[index]);

  const hasUnsavedChanges = useMemo(
    () =>
      Object.keys(originalFormValues).some((id) => {
        if (Array.isArray(originalFormValues[id])) {
          return !areEqual(originalFormValues[id], actualFormValues[id]);
        }
        return originalFormValues[id] !== actualFormValues[id];
      }),
    [originalFormValues, actualFormValues]
  );

  const handleBack = useCallback(() => {
    window.removeEventListener('beforeunload', alertUser);
    if (hasUnsavedChanges) {
      setNavigateBack(true);
      dispatch(
        onUpdateShowUnsavedChangesModal({ showUnsavedChangesModal: true })
      );
    } else {
      // the user can navigate back to the manage profile page or the athlete page depending
      // on which they navigated to athlete profile from.
      historyGo(-1);
    }
  }, [hasUnsavedChanges, historyGo, dispatch]);

  /**
   * The `discardChangesAndHandleBack` function is designed to discard any unsaved changes and navigate back, altering the route in the process.
   * It restores the form to its original state, resets any attachments, and rebuilds the validation state.
   * If the current mode is CREATE, it switches back to VIEW mode.
   * This functionality is particularly useful for handling scenarios where buttons outside of the form in LOPS need to discard changes and navigate away.
   */
  const discardChangesAndHandleBack = () => {
    restoreForm();

    if (mode === MODES.CREATE) {
      dispatch(onSetMode({ mode: MODES.VIEW }));
    }

    historyGo(-1);
  };

  return {
    hasUnsavedChanges,
    showModal,
    setNavigateBack,
    handleCloseModal,
    handleDiscardChanges,
    handleBack,
    discardChangesAndHandleBack,
  };
};

export default useUnsavedChanges;
