// @flow

import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useDeleteFormCategoryMutation } from '@kitman/services/src/services/formTemplates';
import {
  getSelectedFormCategoryId,
  getIsDeleteFormCategoryModalOpen,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formTemplateSettingsSelectors';
import { setIsDeleteFormCategoryModalOpen } from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';
import { DialogContentText } from '@kitman/playbook/components';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import {
  getConfirmDeleteCategoryTranslations,
  getDeleteCategoryToastsText,
} from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/utils/helpers';

import type { ReduxMutation } from '@kitman/common/src/types/Redux';

export const DELETE_CATEGORY_SUCCESS_TOAST_ID =
  'DELETE_CATEGORY_SUCCESS_TOAST_ID';
export const DELETE_CATEGORY_ERROR_TOAST_ID = 'DELETE_CATEGORY_ERROR_TOAST_ID';

const useDeleteCategoryAction = () => {
  const dispatch = useDispatch();

  const { showErrorToast, showSuccessToast } = useShowToasts({
    successToastId: DELETE_CATEGORY_SUCCESS_TOAST_ID,
    errorToastId: DELETE_CATEGORY_ERROR_TOAST_ID,
  });

  const [deleteFormCategory, { isLoading: isDeleteLoading }]: [
    ReduxMutation<Object, void>,
    { isLoading: boolean }
  ] = useDeleteFormCategoryMutation();

  const categoryId = useSelector(getSelectedFormCategoryId);
  const deleteModalOpen = useSelector(getIsDeleteFormCategoryModalOpen);
  const { success, error } = getDeleteCategoryToastsText();

  const handleDeleteFormCategory = async () => {
    try {
      if (categoryId) {
        unwrapResult(await deleteFormCategory({ categoryId }));
        showSuccessToast({
          translatedTitle: success.title,
          translatedDescription: success.description,
        });
      }
    } catch {
      showErrorToast({
        translatedTitle: error.title,
        translatedDescription: error.description,
      });
    }
    dispatch(setIsDeleteFormCategoryModalOpen(false));
  };

  const { content: translatedContent, ...restTranslatedText } =
    getConfirmDeleteCategoryTranslations();

  const dialogContent = (
    <DialogContentText id={modalDescriptionId}>
      {translatedContent}
    </DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={deleteModalOpen}
      isLoading={isDeleteLoading}
      onConfirm={handleDeleteFormCategory}
      onCancel={() => {
        dispatch(setIsDeleteFormCategoryModalOpen(false));
      }}
      onClose={() => {
        dispatch(setIsDeleteFormCategoryModalOpen(false));
      }}
      dialogContent={dialogContent}
      translatedText={restTranslatedText}
      isDeleteAction
    />
  );

  return {
    confirmationModal,
    isDeleteLoading,
  };
};

export default useDeleteCategoryAction;
