// @flow
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { Drawer, Divider, Button, Skeleton } from '@kitman/playbook/components';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import {
  useUpdateFormCategoryMutation,
  useCreateFormCategoryMutation,
  useGetFormCategoryQuery,
} from '@kitman/services/src/services/formTemplates';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import { useShowToasts } from '@kitman/common/src/hooks';

import {
  getIsFormCategoryDrawerOpen,
  getFormCategoryDrawerMode,
  getSelectedFormCategoryId,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formTemplateSettingsSelectors';
import {
  setFormCategoryDrawerMode,
  setIsFormCategoryDrawerOpen,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';

import type { FormCategoryDrawerMode } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import { getDrawerTranslations } from './utils/helpers';

import DrawerContent from './DrawerContent';

const FormCategoryDrawer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDrawerOpen = useSelector(getIsFormCategoryDrawerOpen);
  const formCategoryId = useSelector(getSelectedFormCategoryId);
  const drawerMode: FormCategoryDrawerMode = useSelector(
    getFormCategoryDrawerMode
  );
  const isEditMode = drawerMode === 'EDIT';

  const [categoryName, setCategoryName] = useState<string>('');

  const [productArea, setProductArea] = useState<string | null>('');

  const {
    data: categoryDetails,
    isLoading: isCategoryDetailsLoading,
    isFetching: isCategoryDetailsFetching,
  } = useGetFormCategoryQuery(
    { categoryId: formCategoryId },
    {
      skip: !(isDrawerOpen && isEditMode && formCategoryId),
    }
  );

  useEffect(() => {
    if (!isDrawerOpen) return;
    if (isEditMode && categoryDetails) {
      setCategoryName(categoryDetails.name);
      setProductArea(
        categoryDetails.productAreaId ? categoryDetails.productAreaId : null
      );
    } else if (drawerMode === 'CREATE') {
      setCategoryName('');
      setProductArea(null);
    }
  }, [isDrawerOpen, drawerMode, categoryDetails, isEditMode]);

  const [updateFormCategory]: [
    ReduxMutation<
      {
        formCategoryId: number,
        productArea: string,
        categoryName: string,
      },
      {}
    >,
    { isLoading: boolean }
  ] = useUpdateFormCategoryMutation();

  const [createFormCategory, { isLoading: isCreating }]: [
    ReduxMutation<{ productArea: string, categoryName: string }, {}>,
    { isLoading: boolean }
  ] = useCreateFormCategoryMutation();

  const TOAST_ID_PREFIX = 'FORM_CATEGORY_DRAWER';
  const CREATE_ERROR_TOAST_ID = `${TOAST_ID_PREFIX}_CREATE_ERROR`;
  const CREATE_SUCCESS_TOAST_ID = `${TOAST_ID_PREFIX}_CREATE_SUCCESS`;
  const UPDATE_ERROR_TOAST_ID = `${TOAST_ID_PREFIX}_UPDATE_ERROR`;
  const UPDATE_SUCCESS_TOAST_ID = `${TOAST_ID_PREFIX}_UPDATE_SUCCESS`;

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: isEditMode ? UPDATE_ERROR_TOAST_ID : CREATE_ERROR_TOAST_ID,
    successToastId: isEditMode
      ? UPDATE_SUCCESS_TOAST_ID
      : CREATE_SUCCESS_TOAST_ID,
  });

  const closeDrawer = () => {
    dispatch(setIsFormCategoryDrawerOpen(false));
    dispatch(setFormCategoryDrawerMode('CREATE'));
    // Reset local state
    setCategoryName('');
    setProductArea(null);
  };

  const {
    createCategory,
    editCategory,
    createButton,
    cancelButton,
    saveButton,
    createdFormCategorySuccessMessage,
    createFormCategoryErrorMessage,
    updatedFormCategorySuccessMessage,
    updateFormCategoryErrorMessage,
  } = getDrawerTranslations();

  const isFormInvalid = !productArea || categoryName.trim().length === 0;

  const handleUpdate = async () => {
    if (!formCategoryId || productArea === null) {
      // Basic validation
      showErrorToast({ translatedTitle: updateFormCategoryErrorMessage });
      return;
    }
    try {
      unwrapResult(
        await updateFormCategory({
          formCategoryId,
          productArea,
          categoryName,
        })
      );
      showSuccessToast({
        translatedTitle: updatedFormCategorySuccessMessage,
      });
      closeDrawer();
    } catch {
      showErrorToast({
        translatedTitle: updateFormCategoryErrorMessage,
      });
    }
  };

  const handleCreate = async () => {
    if (productArea === null || !categoryName.trim()) {
      // Basic validation
      showErrorToast({ translatedTitle: createFormCategoryErrorMessage });
      return;
    }
    try {
      unwrapResult(
        await createFormCategory({
          productArea,
          categoryName,
        })
      );
      showSuccessToast({
        translatedTitle: createdFormCategorySuccessMessage,
      });
      closeDrawer();
    } catch {
      showErrorToast({
        translatedTitle: createFormCategoryErrorMessage,
      });
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      anchor="right"
      onClose={closeDrawer}
      hideBackdrop
      sx={{
        ...drawerMixin({ theme, isOpen: isDrawerOpen, drawerWidth: 455 }),
      }}
    >
      <DrawerLayout.Title
        title={isEditMode ? editCategory : createCategory}
        onClose={closeDrawer}
      />
      <Divider />
      <DrawerLayout.Content>
        {isEditMode &&
        (isCategoryDetailsLoading || isCategoryDetailsFetching) ? (
          <>
            <Skeleton animation="wave" height={60} />
            <Skeleton animation="wave" height={60} />
          </>
        ) : (
          <DrawerContent
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            productArea={productArea}
            setProductArea={setProductArea}
            isEditMode={isEditMode}
          />
        )}
      </DrawerLayout.Content>
      <Divider />
      <DrawerLayout.Actions>
        <Button onClick={closeDrawer} sx={{ mr: 1 }} color="secondary">
          {cancelButton}
        </Button>
        <Button
          variant="contained"
          onClick={isEditMode ? handleUpdate : handleCreate}
          disabled={
            isCreating ||
            isFormInvalid ||
            (isEditMode &&
              (isCategoryDetailsLoading || isCategoryDetailsFetching))
          }
        >
          {isEditMode ? saveButton : createButton}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default FormCategoryDrawer;
