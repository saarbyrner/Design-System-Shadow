// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';

export const PROFILE_ERROR_TOAST_ID = 'PROFILE_ERROR_TOAST';
export const PROFILE_INVALIDATON_TOAST_ID = 'PROFILE_INVALIDATON_TOAST_ID';
export const PROFILE_SUCCESS_TOAST_ID = 'PROFILE_SUCCESS_TOAST';
export const PROFILE_SAVE_PROGRESS_TOAST_ID = 'PROFILE_SAVE_PROGRESS_TOAST';

export const PROFILE_REDIRECT_TOAST_ID = 'PROFILE_REDIRECT_TOAST_ID';
export const SECTION_UPDATE_PENDING_TOAST_ID =
  'SECTION_UPDATE_PENDING_TOAST_ID';
export const SECTION_UPDATE_SUCCESS_TOAST_ID =
  'SECTION_UPDATE_SUCCESS_TOAST_ID';
export const SECTION_UPDATE_FAILURE_TOAST_ID =
  'SECTION_UPDATE_FAILURE_TOAST_ID';

export const APPLY_STATUS_FAILURE_TOAST_ID = 'APPLY_STATUS_FAILURE_TOAST_ID';
export const APPLY_STATUS_SUCCESS_TOAST_ID = 'APPLY_STATUS_SUCCESS_TOAST_ID';
export const APPLY_STATUS_PENDING_TOAST_ID = 'APPLY_STATUS_PENDING_TOAST_ID';

export const UPDATE_REGISTRATION_FAILURE_TOAST_ID =
  'UPDATE_REGISTRATION_FAILURE_TOAST_ID';
export const UPDATE_REGISTRATION_SUCCESS_TOAST_ID =
  'UPDATE_REGISTRATION_SUCCESS_TOAST_ID';
export const UPDATE_REGISTRATION_PENDING_TOAST_ID =
  'UPDATE_REGISTRATION_PENDING_TOAST_ID';

const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';
const LOADING = 'LOADING';

const useFormToasts = () => {
  const dispatch = useDispatch();

  const onClearToasts = useCallback(() => {
    dispatch(remove(PROFILE_ERROR_TOAST_ID));
    dispatch(remove(PROFILE_SUCCESS_TOAST_ID));
  }, [dispatch]);

  const onInvalidationToast = () => {
    dispatch(
      add({
        id: PROFILE_INVALIDATON_TOAST_ID,
        status: ERROR,
        title: i18n.t('Please fill in required fields'),
      })
    );
  };

  const onSaveSuccessToast = () => {
    dispatch(
      add({
        id: PROFILE_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Registration successfully submitted.'),
      })
    );
  };

  const onSaveProgressToast = () => {
    dispatch(
      add({
        id: PROFILE_SAVE_PROGRESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Registration successfully saved.'),
      })
    );
  };


  const onSaveErrorToast = () => {
    dispatch(
      add({
        id: PROFILE_ERROR_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to save. Try again'),
      })
    );
  };

  const onSaveRedirectToast = () => {
    dispatch(
      add({
        id: PROFILE_REDIRECT_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Returning to requirement page.'),
      })
    );
  };

  const onUpdateSectionPendingToast = () => {
    dispatch(
      add({
        id: SECTION_UPDATE_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Saving details.'),
      })
    );
  };

  const onUpdateSectionSuccessToast = () => {
    dispatch(
      add({
        id: SECTION_UPDATE_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Details successfully updated.'),
      })
    );
  };

  const onUpdateSectionFailureToast = () => {
    dispatch(
      add({
        id: SECTION_UPDATE_FAILURE_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to save details. Try again.'),
      })
    );
  };

  const onClearSectionToasts = useCallback(() => {
    dispatch(remove(SECTION_UPDATE_SUCCESS_TOAST_ID));
    dispatch(remove(SECTION_UPDATE_FAILURE_TOAST_ID));
    dispatch(remove(SECTION_UPDATE_PENDING_TOAST_ID));
  }, [dispatch]);

  const onApplySectionPendingToast = () => {
    dispatch(
      add({
        id: APPLY_STATUS_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Updating requirement.'),
      })
    );
  };

  const onApplySectionSuccessToast = () => {
    dispatch(
      add({
        id: APPLY_STATUS_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Requirement successfully updated.'),
      })
    );
  };

  const onApplySectionFailureToast = () => {
    dispatch(
      add({
        id: APPLY_STATUS_FAILURE_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to update status. Try again.'),
      })
    );
  };

  const onClearApplyStatusToasts = useCallback(() => {
    dispatch(remove(APPLY_STATUS_PENDING_TOAST_ID));
    dispatch(remove(APPLY_STATUS_SUCCESS_TOAST_ID));
    dispatch(remove(APPLY_STATUS_FAILURE_TOAST_ID));
  }, [dispatch]);

  const onUpdateRegistrationPendingToast = () => {
    dispatch(
      add({
        id: UPDATE_REGISTRATION_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Updating registration status.'),
      })
    );
  };

  const onUpdateRegistrationSuccessToast = () => {
    dispatch(
      add({
        id: UPDATE_REGISTRATION_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Registration status successfully updated.'),
      })
    );
  };

  const onUpdateRegistrationFailureToast = () => {
    dispatch(
      add({
        id: UPDATE_REGISTRATION_PENDING_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to update registration status. Try again.'),
      })
    );
  };

  const onClearUpdateRegistrationToasts = useCallback(() => {
    dispatch(remove(UPDATE_REGISTRATION_PENDING_TOAST_ID));
    dispatch(remove(UPDATE_REGISTRATION_SUCCESS_TOAST_ID));
    dispatch(remove(UPDATE_REGISTRATION_PENDING_TOAST_ID));
  }, [dispatch]);

  return {
    onClearToasts,
    onInvalidationToast,
    onSaveErrorToast,
    onSaveSuccessToast,
    onSaveRedirectToast,
    onSaveProgressToast,
    onUpdateSectionPendingToast,
    onUpdateSectionSuccessToast,
    onUpdateSectionFailureToast,
    onClearSectionToasts,
    onApplySectionPendingToast,
    onApplySectionSuccessToast,
    onApplySectionFailureToast,
    onClearApplyStatusToasts,
    onUpdateRegistrationFailureToast,
    onUpdateRegistrationPendingToast,
    onUpdateRegistrationSuccessToast,
    onClearUpdateRegistrationToasts,
  };
};

export default useFormToasts;
