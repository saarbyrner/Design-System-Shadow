// @flow
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { Drawer, Divider, Button } from '@kitman/playbook/components';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import { useUpdateFormTemplateMetadataMutation } from '@kitman/services/src/services/formTemplates';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { UpdateFormTemplateMetadataRequestBody } from '@kitman/services/src/services/formTemplates/api/formTemplates/updateFormTemplateMetadata';
import { useShowToasts } from '@kitman/common/src/hooks';

import {
  getIsFormTemplateDrawerOpen,
  getFormTemplateDrawerMode,
  getSelectedFormId,
  getFormTemplatesMap,
} from '../../redux/selectors/formTemplateSelectors';
import {
  toggleIsFormTemplateDrawerOpen,
  setFormTemplateDrawerMode,
  type FormTemplateDrawerMode,
  type FormTemplatesMap,
} from '../../redux/slices/formTemplatesSlice';
import { getDrawerTranslations } from './utils/helpers';
import { getFormMetaData } from '../../redux/selectors/formBuilderSelectors';
import {
  resetMetaData,
  setMetaDataField,
} from '../../redux/slices/formBuilderSlice';
import DrawerContent from './DrawerContent';
import type { FormMetaData } from '../../redux/slices/utils/types';

type Props = {
  onClickingCreate: () => void,
};

const FormTemplateDrawer = ({ onClickingCreate }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDrawerOpen = useSelector(getIsFormTemplateDrawerOpen);
  const formMetaData: FormMetaData = useSelector(getFormMetaData);
  const formId = useSelector(getSelectedFormId);
  const formTemplatesMap: FormTemplatesMap = useSelector(getFormTemplatesMap);
  const drawerMode: FormTemplateDrawerMode = useSelector(
    getFormTemplateDrawerMode
  );
  const isEditMode = drawerMode === 'EDIT';

  const [
    updateFormTemplateMetadata,
    { isLoading: isUpdateFormTemplateMetadataLoading },
  ]: [
    ReduxMutation<
      {
        formId: number,
        formTemplateId: number,
        requestBody: UpdateFormTemplateMetadataRequestBody,
      },
      {}
    >,
    { isLoading: boolean }
  ] = useUpdateFormTemplateMetadataMutation();

  const UPDATE_FORM_TEMPLATE_METADATA_ERROR_TOAST_ID =
    'UPDATE_FORM_TEMPLATE_METADATA_ERROR_TOAST_ID';
  const UPDATE_FORM_TEMPLATE_METADATA_SUCCESS_TOAST_ID =
    'UPDATE_FORM_TEMPLATE_METADATA_SUCCESS_TOAST_ID';

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: UPDATE_FORM_TEMPLATE_METADATA_ERROR_TOAST_ID,
    successToastId: UPDATE_FORM_TEMPLATE_METADATA_SUCCESS_TOAST_ID,
  });

  useEffect(() => {
    if (isEditMode && formId) {
      const { name, category, fullname, formCategory } =
        formTemplatesMap[formId];

      dispatch(setMetaDataField({ value: name, field: 'title' }));
      dispatch(setMetaDataField({ value: category, field: 'category' }));
      dispatch(setMetaDataField({ value: fullname, field: 'description' }));
      dispatch(
        setMetaDataField({ value: formCategory?.id, field: 'formCategoryId' })
      );
      dispatch(
        setMetaDataField({
          value: formCategory?.name,
          field: 'formCategoryName',
        })
      );
    }
  }, [isEditMode, formId, formTemplatesMap, dispatch]);

  const closeDrawer = () => {
    dispatch(toggleIsFormTemplateDrawerOpen());
    dispatch(resetMetaData());
    dispatch(setFormTemplateDrawerMode('CREATE'));
  };

  const {
    createTitle,
    editTitle,
    createButton,
    cancelButton,
    saveButton,
    updatedFormTemplateMetadataSuccessMessage,
    updateFormTemplateMetadataErrorMessage,
  } = getDrawerTranslations();

  const shouldDisableCreateButton =
    formMetaData.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().length === 0 ||
    formMetaData.category?.length === 0;

  const onClickingSave = async () => {
    try {
      if (formId) {
        const { id: formTemplateId } = formTemplatesMap[formId];

        unwrapResult(
          await updateFormTemplateMetadata({
            formId,
            formTemplateId,
            requestBody: {
              name: formMetaData.title,
              fullname: formMetaData.description,
              form_category_id: formMetaData.formCategoryId,
              category: formMetaData.productArea,
            },
          })
        );

        showSuccessToast({
          translatedTitle: updatedFormTemplateMetadataSuccessMessage,
        });

        closeDrawer();
      }
    } catch {
      showErrorToast({
        translatedTitle: updateFormTemplateMetadataErrorMessage,
      });
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      anchor="right"
      onClose={closeDrawer}
      hideBackdrop
      sx={drawerMixin({ theme, isOpen: isDrawerOpen, drawerWidth: 455 })}
    >
      <DrawerLayout.Title
        title={isEditMode ? editTitle : createTitle}
        onClose={closeDrawer}
      />
      <Divider />
      <DrawerLayout.Content>
        <DrawerContent />
      </DrawerLayout.Content>
      <Divider />
      <DrawerLayout.Actions>
        <Button onClick={closeDrawer} sx={{ mr: 1 }} color="secondary">
          {cancelButton}
        </Button>
        <Button
          variant="contained"
          disabled={
            shouldDisableCreateButton || isUpdateFormTemplateMetadataLoading
          }
          onClick={isEditMode ? onClickingSave : onClickingCreate}
        >
          {isEditMode ? saveButton : createButton}
        </Button>
      </DrawerLayout.Actions>
    </Drawer>
  );
};

export default FormTemplateDrawer;
