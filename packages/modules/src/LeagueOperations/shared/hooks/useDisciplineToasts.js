/* eslint-disable max-statements */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';

const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';
const LOADING = 'LOADING';

export const CREATE_DISCIPLINARY_FAILURE_TOAST_ID =
  'CREATE_DISCIPLINARY_FAILURE_TOAST_ID';
export const CREATE_DISCIPLINARY_SUCCESS_TOAST_ID =
  'CREATE_DISCIPLINARY_SUCCESS_TOAST_ID';
export const CREATE_DISCIPLINARY_PENDING_TOAST_ID =
  'CREATE_DISCIPLINARY_PENDING_TOAST_ID';

export const UPDATE_DISCIPLINARY_FAILURE_TOAST_ID =
  'UPDATE_DISCIPLINARY_FAILURE_TOAST_ID';
export const UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID =
  'UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID';
export const UPDATE_DISCIPLINARY_PENDING_TOAST_ID =
  'UPDATE_DISCIPLINARY_PENDING_TOAST_ID';

export const DELETE_DISCIPLINARY_FAILURE_TOAST_ID =
  'DELETE_DISCIPLINARY_FAILURE_TOAST_ID';
export const DELETE_DISCIPLINARY_SUCCESS_TOAST_ID =
  'DELETE_DISCIPLINARY_SUCCESS_TOAST_ID';
export const DELETE_DISCIPLINARY_PENDING_TOAST_ID =
  'DELETE_DISCIPLINARY_PENDING_TOAST_ID';

const useDisciplineToasts = () => {
  const dispatch = useDispatch();

  const onUpdateSuccessToast = () => {
    dispatch(
      add({
        id: UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Disciplinary issue successfully updated.'),
      })
    );
  };

  const onUpdateFailureToast = () => {
    dispatch(
      add({
        id: UPDATE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to update disciplinary issue. Try again'),
      })
    );
  };

  const onUpdatePendingToast = () => {
    dispatch(
      add({
        id: UPDATE_DISCIPLINARY_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Disciplinary issue updating.'),
      })
    );
  };

  const onDeletePendingToast = () => {
    dispatch(
      add({
        id: DELETE_DISCIPLINARY_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Disciplinary issue deleting.'),
      })
    );
  };

  const onDeleteSuccessToast = () => {
    dispatch(
      add({
        id: DELETE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Disciplinary issue deleted.'),
      })
    );
  };

  const onDeleteFailureToast = () => {
    dispatch(
      add({
        id: DELETE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to delete disciplinary issue. Try again.'),
      })
    );
  };

  const onCreatePendingToast = () => {
    dispatch(
      add({
        id: CREATE_DISCIPLINARY_PENDING_TOAST_ID,
        status: LOADING,
        title: i18n.t('Saving disciplinary issue.'),
      })
    );
  };

  const onCreateSuccessToast = () => {
    dispatch(
      add({
        id: CREATE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: SUCCESS,
        title: i18n.t('Disciplinary issue saved.'),
      })
    );
  };

  const onCreateFailureToast = () => {
    dispatch(
      add({
        id: CREATE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: ERROR,
        title: i18n.t('Unable to create disciplinary issue. Try again.'),
      })
    );
  };

  const onClearUpdateToasts = useCallback(() => {
    dispatch(remove(UPDATE_DISCIPLINARY_FAILURE_TOAST_ID));
    dispatch(remove(UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID));
    dispatch(remove(UPDATE_DISCIPLINARY_PENDING_TOAST_ID));
  }, [dispatch]);

  const onClearCreateToasts = useCallback(() => {
    dispatch(remove(CREATE_DISCIPLINARY_FAILURE_TOAST_ID));
    dispatch(remove(CREATE_DISCIPLINARY_SUCCESS_TOAST_ID));
    dispatch(remove(CREATE_DISCIPLINARY_PENDING_TOAST_ID));
  }, [dispatch]);

  const onClearDeleteToasts = useCallback(() => {
    dispatch(remove(DELETE_DISCIPLINARY_FAILURE_TOAST_ID));
    dispatch(remove(DELETE_DISCIPLINARY_SUCCESS_TOAST_ID));
    dispatch(remove(DELETE_DISCIPLINARY_PENDING_TOAST_ID));
  }, [dispatch]);

  return {
    onUpdateSuccessToast,
    onUpdateFailureToast,
    onUpdatePendingToast,
    onClearUpdateToasts,
    onDeletePendingToast,
    onDeleteSuccessToast,
    onDeleteFailureToast,
    onClearDeleteToasts,
    onCreatePendingToast,
    onCreateSuccessToast,
    onCreateFailureToast,
    onClearCreateToasts,
  };
};

export default useDisciplineToasts;
