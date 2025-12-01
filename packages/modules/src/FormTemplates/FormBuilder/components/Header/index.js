// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import { useState, type ComponentType } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  CircularProgress,
  Backdrop,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors, FALLBACK_DASH } from '@kitman/common/src/variables';
import {
  getFormMetaData,
  getFormStructure,
  getOriginalFormStructure,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import {
  useCreateFormTemplateMutation,
  useUpdateFormTemplateMutation,
} from '@kitman/services/src/services/formTemplates';
import type {
  CreateFormTemplateReturnType,
  CreateFormTemplateRequestBody,
} from '@kitman/services/src/services/formTemplates/api/formTemplates/create';
import type {
  UpdateFormTemplateRequestBody,
  UpdateFormTemplateReturnType,
} from '@kitman/services/src/services/formTemplates/api/formTemplates/updateFormTemplate';
import {
  setShowFormBuilder,
  resetFormBuilderMetadata,
  setFormTemplateStructure,
  setOriginalFormTemplateStructure,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '@kitman/modules/src/AthleteProfile/src/components/UnsavedChangesModal/UnsavedChangesModal';
import { useShowToasts, useEventTracking } from '@kitman/common/src/hooks';
import type { FormMetaData } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import type { FormStructure } from '@kitman/modules/src/FormTemplates/shared/types';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import HeaderInfoItem from './components/HeaderInfoItem';
import { buildCreateFormTemplateRequestBody } from './utils/helpers';

type Props = {
  handleBack: () => void,
  formTemplateId: number | null,
  isLoading: boolean,
};

const Header = ({
  handleBack,
  formTemplateId,
  t,
  isLoading,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] =
    useState<boolean>(false);
  const formMetaData: FormMetaData = useSelector(getFormMetaData);
  const formStructure: FormStructure = useSelector(getFormStructure);
  const originalFormStructure: FormStructure = useSelector(
    getOriginalFormStructure
  );
  const [createFormTemplate, { isLoading: isCreateFormTemplateLoading }]: [
    ReduxMutation<CreateFormTemplateRequestBody, CreateFormTemplateReturnType>,
    { isLoading: boolean }
  ] = useCreateFormTemplateMutation();
  const [updateFormTemplate, { isLoading: isUpdateFormTemplateLoading }]: [
    ReduxMutation<
      { formTemplateId: number, requestBody: UpdateFormTemplateRequestBody },
      UpdateFormTemplateReturnType
    >,
    { isLoading: boolean }
  ] = useUpdateFormTemplateMutation();

  const CREATE_FORM_TEMPLATE_ERROR_TOAST_ID =
    'CREATE_FORM_TEMPLATE_ERROR_TOAST_ID';
  const CREATE_FORM_TEMPLATE_SUCCESS_TOAST_ID =
    'CREATE_FORM_TEMPLATE_SUCCESS_TOAST_ID';

  const UPDATE_FORM_TEMPLATE_ERROR_TOAST_ID =
    'UPDATE_FORM_TEMPLATE_ERROR_TOAST_ID';
  const UPDATE_FORM_TEMPLATE_SUCCESS_TOAST_ID =
    'UPDATE_FORM_TEMPLATE_SUCCESS_TOAST_ID';

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: formTemplateId
      ? UPDATE_FORM_TEMPLATE_ERROR_TOAST_ID
      : CREATE_FORM_TEMPLATE_ERROR_TOAST_ID,
    successToastId: formTemplateId
      ? UPDATE_FORM_TEMPLATE_SUCCESS_TOAST_ID
      : CREATE_FORM_TEMPLATE_SUCCESS_TOAST_ID,
  });

  const formTemplateHasUnsavedChanges =
    JSON.stringify(formStructure) !== JSON.stringify(originalFormStructure);

  const onHandleCreateButton = async () => {
    try {
      const createFormTemplateRequestBody = buildCreateFormTemplateRequestBody({
        formMetaData,
        formStructure,
      });

      unwrapResult(await createFormTemplate(createFormTemplateRequestBody));

      showSuccessToast({
        translatedTitle: t('Successfully created form template'),
      });

      trackEvent('Form Template - Form Creation Complete ');

      dispatch(setShowFormBuilder(false));
    } catch {
      showErrorToast({
        translatedTitle: t('Failed to create form template. Please try again'),
      });
    }
  };

  const onHandleSaveButton = async () => {
    try {
      const updateFormTemplateRequestBody = buildCreateFormTemplateRequestBody({
        formMetaData,
        formStructure,
      });

      if (formTemplateId) {
        const data = await updateFormTemplate({
          formTemplateId,
          requestBody: updateFormTemplateRequestBody,
        }).unwrap();

        if (data) {
          dispatch(
            setFormTemplateStructure({
              structure: data.form_template?.last_template_version,
            })
          );
          dispatch(
            setOriginalFormTemplateStructure({
              structure: data.form_template?.last_template_version,
            })
          );
        }

        trackEvent('Form Template - Edited', {
          formTemplateId,
        });

        showSuccessToast({
          translatedTitle: t('Successfully updated form template'),
        });
      }
    } catch {
      showErrorToast({
        translatedTitle: t('Failed to update form template. Please try again'),
      });
    }
  };

  const handleClickBack = () => {
    dispatch(resetFormBuilderMetadata());

    if (formTemplateId) {
      handleBack();
    } else {
      dispatch(setShowFormBuilder(false));
    }
  };

  return (
    <Box sx={{ p: '1rem' }}>
      <Button
        size="small"
        variant="text"
        startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ArrowBack} />}
        onClick={() => {
          if (formTemplateHasUnsavedChanges) {
            setShowUnsavedChangesModal(true);
          } else {
            handleClickBack();
          }
        }}
      >
        {t('Forms Overview')}
      </Button>
      <Box
        sx={{ width: '100%' }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={0.5}
      >
        <Typography variant="h5" color={colors.grey_200}>
          {isLoading ? <Skeleton width={300} /> : formMetaData.title}
        </Typography>
        <Box>
          <Button
            sx={{ mx: 0.5 }}
            disabled={
              isCreateFormTemplateLoading ||
              isUpdateFormTemplateLoading ||
              (formTemplateId && !formTemplateHasUnsavedChanges)
            }
            onClick={async () => {
              if (formTemplateId) {
                onHandleSaveButton();
              } else {
                onHandleCreateButton();
              }
            }}
          >
            {formTemplateId ? t('Save') : t('Create')}
          </Button>
        </Box>
      </Box>
      <Grid container spacing={5}>
        <HeaderInfoItem
          label={t('Product Area')}
          value={capitalize(formMetaData.productArea) || FALLBACK_DASH}
          isLoading={isLoading}
        />
        <HeaderInfoItem
          label={t('Category')}
          value={formMetaData.category || FALLBACK_DASH}
          isLoading={isLoading}
        />
        <HeaderInfoItem
          label={t('Created')}
          value={formMetaData.createdAt || FALLBACK_DASH}
          isLoading={isLoading}
        />
        <HeaderInfoItem
          label={t('Creator')}
          value={formMetaData.creator || FALLBACK_DASH}
          isLoading={isLoading}
        />
        <HeaderInfoItem
          label={t('Description')}
          value={formMetaData.description || FALLBACK_DASH}
          isLoading={isLoading}
        />
      </Grid>
      <UnsavedChangesModal
        showModal={showUnsavedChangesModal}
        handleCloseModal={() => {
          setShowUnsavedChangesModal(false);
        }}
        handleDiscardChanges={() => {
          setShowUnsavedChangesModal(false);
          handleClickBack();
        }}
      />
      <Backdrop
        sx={(theme) => ({
          color: colors.white,
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={isCreateFormTemplateLoading || isUpdateFormTemplateLoading}
      >
        <CircularProgress data-testid="circular-progress" color="inherit" />
      </Backdrop>
    </Box>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
