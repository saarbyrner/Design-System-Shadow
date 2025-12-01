// @flow

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useShowToasts } from '@kitman/common/src/hooks';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';

import {
  useSearchFormTemplatesQuery,
  useDeleteFormTemplateMutation,
} from '@kitman/services/src/services/formTemplates';
import {
  getFilterCategory,
  getSearchQuery,
  getSelectedFormTemplateId,
  getIsFormTemplateDeleteModalOpen,
  getSelectedFormName,
  getFilterFormCategoryId,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formTemplateSelectors';
import {
  addMenuItemToCurrentMenuGroup,
  addQuestionToCurrentMenuItem,
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  onBuildFormTemplatesMap,
  toggleIsFormTemplateDeleteModalOpen,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import type { CustomHookReturnType } from '@kitman/common/src/hooks/useGlobalAppBasicLoader';
import type { SearchFormTemplatesRequestBody } from '@kitman/services/src/services/formTemplates/api/formTemplates/search';
import type {
  FormTemplate,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import { DialogContentText } from '@kitman/playbook/components';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import { getConfirmDeleteTranslations, getDeleteToastsText } from './helpers';

export const DELETE_FORM_TEMPLATE_SUCCESS_TOAST_ID =
  'DELETE_FORM_TEMPLATE_SUCCESS_TOAST_ID';
export const DELETE_FORM_TEMPLATE_ERROR_TOAST_ID =
  'DELETE_FORM_TEMPLATE_ERROR_TOAST_ID';

const initialMeta: MetaCamelCase = {
  currentPage: 0,
  nextPage: 0,
  prevPage: 0,
  totalCount: 0,
  totalPages: 0,
};

export const initialData = {
  data: [],
  meta: initialMeta,
};

export const useFormTemplates = (
  currentPage: number,
  rowsPerPage: number
): {
  rows: Array<FormTemplate>,
  meta: MetaCamelCase,
  ...$Exact<CustomHookReturnType>,
} => {
  const dispatch = useDispatch();
  const selectedCategory: string = useSelector(getFilterCategory);
  const selectedFormCategoryId: number = useSelector(getFilterFormCategoryId);
  const searchQuery: string = useSelector(getSearchQuery);

  const requestBody: SearchFormTemplatesRequestBody = {
    searchQuery,
    filters: {
      category: selectedCategory === '' ? undefined : selectedCategory,
      formCategoryId:
        selectedFormCategoryId === 0 ? undefined : selectedFormCategoryId,
    },
    pagination: {
      page: currentPage,
      perPage: rowsPerPage,
    },
  };

  const {
    data = initialData,
    isLoading,
    isSuccess,
    isError,
  }: {
    data: { data: Array<FormTemplate>, meta: MetaCamelCase },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useSearchFormTemplatesQuery(requestBody);

  const { data: rows, meta } = data;

  useEffect(() => {
    if (rows.length) {
      dispatch(onBuildFormTemplatesMap({ formTemplates: rows }));
    }
  }, [rows, dispatch]);
  return { isLoading, isSuccess, isError, rows, meta };
};

// This hook will be either deleted or rewritten, once we have the side panel with the form in place
export const useInitializeFormBuilder = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // This is temp, just to populate the menu with some items, to show it properly
    dispatch(addQuestionToCurrentMenuItem());
    dispatch(addQuestionToCurrentMenuItem());
    dispatch(addMenuItemToCurrentMenuGroup());
    dispatch(setCurrentMenuItemIndex(1));
    dispatch(addQuestionToCurrentMenuItem());
    dispatch(addQuestionToCurrentMenuItem());

    dispatch(setCurrentMenuGroupIndex(0));
    dispatch(setCurrentMenuItemIndex(0));
  }, [dispatch]);
};

export const useDeleteFormTemplateAction = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const { showErrorToast, showSuccessToast } = useShowToasts({
    successToastId: DELETE_FORM_TEMPLATE_SUCCESS_TOAST_ID,
    errorToastId: DELETE_FORM_TEMPLATE_ERROR_TOAST_ID,
  });

  const [deleteFormTemplate, { isLoading: isDeleteLoading }]: [
    ReduxMutation<Object, void>,
    { isLoading: boolean }
  ] = useDeleteFormTemplateMutation();

  const formTemplateId = useSelector(getSelectedFormTemplateId);
  const selectedFormName = useSelector(getSelectedFormName);
  const deleteModalOpen = useSelector(getIsFormTemplateDeleteModalOpen);

  const { success, error } = getDeleteToastsText();

  const trackDeleteEvents = () => {
    trackEvent('Form Template - Form Template Deleted', {
      formTemplateId,
    });
  };

  const handleDeleteFormTemplate = async () => {
    try {
      if (formTemplateId) {
        unwrapResult(await deleteFormTemplate({ formTemplateId }));
        showSuccessToast({
          translatedTitle: success.title,
          translatedDescription: success.description,
        });
        trackDeleteEvents();
      }
    } catch {
      showErrorToast({
        translatedTitle: error.title,
        translatedDescription: error.description,
      });
    }
    dispatch(toggleIsFormTemplateDeleteModalOpen());
  };

  const { content: translatedContent, ...restTranslatedText } =
    getConfirmDeleteTranslations(selectedFormName);

  const dialogContent = (
    <DialogContentText id={modalDescriptionId}>
      {translatedContent}
    </DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={deleteModalOpen}
      isLoading={isDeleteLoading}
      onConfirm={handleDeleteFormTemplate}
      onCancel={() => {
        dispatch(toggleIsFormTemplateDeleteModalOpen());
      }}
      onClose={() => {
        dispatch(toggleIsFormTemplateDeleteModalOpen());
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
