/* eslint-disable max-depth */
// @flow

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Node } from 'react';

import { Button } from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import i18n from '@kitman/common/src/utils/i18n';

import {
  onSetMode,
  onSetFormAnswersSet,
  onSetAthleteData,
  onResetForm,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { onResetAttachmentsQueue } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { createFormAnswersRequestBody } from '@kitman/modules/src/HumanInput/shared/utils';
import {
  getFormAnswerSetIdFactory,
  getFormAnswersFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  MODES,
  FORMS_PRODUCT_AREAS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  INVALID,
  PENDING,
} from '@kitman/modules/src/HumanInput/types/validation';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useCancelFormEdit } from '@kitman/modules/src/HumanInput/hooks/helperHooks';
import type { FormData } from '@kitman/common/src/utils/TrackingData/src/types/forms';
import type {
  HumanInputForm,
  SettingsConfig,
  FormStatus,
} from '@kitman/modules/src/HumanInput/types/forms';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { getFormData } from '@kitman/common/src/utils/TrackingData/src/data/forms/getFormData';

import type {
  FormUpdateRequestBody,
  BulkCreateFormAnswersSetRequestBody,
} from '@kitman/services/src/services/humanInput/api/types';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { alertUser } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/helpers';

export type ReturnType = {
  actionButtons: Node[],
  isSaving: boolean,
};

type UseActionButtons = {
  onUpdate: (requestBody: FormUpdateRequestBody) => Promise<HumanInputForm>,
  onBulkCreate?: (
    requestBody: BulkCreateFormAnswersSetRequestBody
  ) => Promise<HumanInputForm>,
  toastIds: { errorToastId: string, successToastId: string },
  doesUserHaveRequiredPermissions?: boolean,
  isGenericForm: boolean,
  isLoading?: boolean,
  isAutosaving?: boolean,
  formId?: string,
  userId?: number,
  organisationId?: number,
  formTemplateSettingsConfig?: SettingsConfig,
  productArea: $Values<typeof FORMS_PRODUCT_AREAS>,
  formStatus?: FormStatus,
};

const useActionButtons = ({
  onUpdate,
  onBulkCreate,
  toastIds,
  doesUserHaveRequiredPermissions,
  isGenericForm,
  isLoading,
  isAutosaving = false,
  formId,
  userId = null,
  productArea,
  formTemplateSettingsConfig,
  organisationId,
  formStatus = FORM_STATUS.COMPLETE,
}: UseActionButtons): ReturnType => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const locationAssign = useLocationAssign();
  const historyGo = useHistoryGo();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const formAnswerSetId = useSelector(getFormAnswerSetIdFactory());
  const formAnswers = useSelector(getFormAnswersFactory());
  const mode = useSelector(getModeFactory());
  const fullFormValidationStatus = useStatus({
    fields: Object.keys(formAnswers).map(Number),
  });
  const {
    data: permissions = DEFAULT_CONTEXT_VALUE.permissions,
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const isSubmitButtonDisabled: boolean =
    fullFormValidationStatus === INVALID ||
    fullFormValidationStatus === PENDING ||
    isSaving ||
    (isGenericForm && isAutosaving);

  const shouldDisableSaveButton =
    isSaving ||
    isLoading ||
    (isGenericForm && isAutosaving) ||
    (isGenericForm && isSubmitButtonDisabled); // Disable when autosaving
  const { showErrorToast, showSuccessToast } = useShowToasts({ ...toastIds });
  const { onCancelFormEdit } = useCancelFormEdit(mode);

  const { trackEvent } = useEventTracking();

  const cancelButton = (
    <Button
      key="cancel"
      onClick={onCancelFormEdit}
      disabled={isSaving}
      size="small"
      color="secondary"
    >
      {i18n.t('Cancel')}
    </Button>
  );

  const trackOnSaveEvents = useCallback(
    (isSavingProgress: boolean, formData: FormData) => {
      if (isGenericForm) {
        let eventText: string;
        if (productArea === FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW) {
          eventText = isSavingProgress
            ? 'Staff - Form Answer Set Saved as Draft for Athlete'
            : 'Staff - Form Answer Set Edited for Athlete';
        } else {
          eventText = isSavingProgress
            ? 'Athlete - Form Answer Set Saved as Draft'
            : 'Athlete - Form Answer Set Edited';
        }

        trackEvent(eventText, formData);
      }
    },
    [isGenericForm, productArea, trackEvent]
  );

  const onSave = useCallback(
    async ({ isSavingProgress = false }: { isSavingProgress?: boolean }) => {
      if (
        fullFormValidationStatus === 'INVALID' ||
        (fullFormValidationStatus === 'PENDING' && !isSavingProgress)
      ) {
        showErrorToast({
          translatedTitle: i18n.t('Please fill in required fields'),
        });
      } else {
        setIsSaving(true);
        const requestBody = createFormAnswersRequestBody(
          formAnswerSetId,
          formAnswers,
          isSavingProgress
        );

        try {
          const data = await onUpdate(requestBody);

          const successToastTitle = isSavingProgress
            ? i18n.t('Progress Saved')
            : i18n.t('Information has been saved');

          showSuccessToast({
            translatedTitle: successToastTitle,
          });

          trackOnSaveEvents(isSavingProgress, getFormData(data));

          // update form answers set from the response
          if (data) {
            dispatch(
              onSetFormAnswersSet({
                formAnswers: data.form_answers,
              })
            );
            dispatch(
              onSetAthleteData({
                athlete: data.athlete,
              })
            );
          }

          window.removeEventListener('beforeunload', alertUser);

          if (isGenericForm) {
            dispatch(onResetForm());
            dispatch(onResetAttachmentsQueue());

            historyGo(-1);
          }
        } catch {
          showErrorToast({
            translatedTitle: i18n.t('Unable to save. Try again'),
          });
        }

        setIsSaving(false);
        dispatch(onSetMode({ mode: MODES.VIEW }));
      }
    },
    [
      onUpdate,
      formAnswerSetId,
      formAnswers,
      fullFormValidationStatus,
      showErrorToast,
      showSuccessToast,
      dispatch,
      isGenericForm,
      trackOnSaveEvents,
      historyGo,
    ]
  );

  const onEdit = () => {
    dispatch(onSetMode({ mode: MODES.EDIT }));
  };

  const saveButtonText = isGenericForm ? i18n.t('Submit') : i18n.t('Save');
  const saveButton = (
    <Button
      key={isGenericForm ? 'submit' : 'save'}
      onClick={onSave}
      size="small"
      disabled={shouldDisableSaveButton}
    >
      {isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SendOutlined} />
      ) : (
        saveButtonText
      )}
    </Button>
  );

  const saveProgressButtonText = i18n.t('Save as draft');

  const saveProgressInEditModeButton = (
    <Button
      key="saveProgress"
      color="secondary"
      size="small"
      onClick={() => onSave({ isSavingProgress: true })}
      disabled={isSaving || isLoading || isAutosaving}
    >
      {isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SaveAs} />
      ) : (
        saveProgressButtonText
      )}
    </Button>
  );

  const editButton = (
    <Button
      key="edit"
      size="small"
      disabled={mode !== MODES.VIEW}
      onClick={onEdit}
    >
      {i18n.t('Edit')}
    </Button>
  );

  const trackOnCreateEvents = useCallback(
    (isSavingProgress: boolean, formData: FormData) => {
      if (isGenericForm) {
        let eventText: string;
        if (productArea === FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW) {
          eventText = isSavingProgress
            ? 'Staff - Form Answer Set Saved as Draft for Athlete'
            : 'Staff - Form Answer Set Created for Athlete';
        } else {
          eventText = isSavingProgress
            ? 'Athlete - Form Answer Set Saved as Draft'
            : 'Athlete - Form Answer Set Submitted';
        }

        trackEvent(eventText, formData);
      }
    },
    [isGenericForm, productArea, trackEvent]
  );

  const onCreate = useCallback(
    async ({ isSavingProgress = false }: { isSavingProgress?: boolean }) => {
      if (fullFormValidationStatus === 'INVALID' && !isSavingProgress) {
        showErrorToast({
          translatedTitle: i18n.t('Please fill in required fields'),
        });
      } else {
        setIsSaving(true);

        const { status, answers } = createFormAnswersRequestBody(
          formAnswerSetId,
          formAnswers,
          isSavingProgress
        );

        try {
          if (onBulkCreate) {
            const data = await onBulkCreate({
              formId: +formId,
              userId,
              status,
              answers,
              organisationId,
            });

            showSuccessToast({
              translatedTitle: isSavingProgress
                ? i18n.t('Progress Saved')
                : i18n.t('Information has been saved'),
            });

            if (isSavingProgress) {
              // update form answers set from the response
              if (data) {
                dispatch(
                  onSetFormAnswersSet({
                    formAnswers: data.form_answers,
                  })
                );
                dispatch(
                  onSetAthleteData({
                    athlete: data.athlete,
                  })
                );
              }
            }

            trackOnCreateEvents(isSavingProgress, getFormData(data));

            dispatch(onResetForm());
            dispatch(onResetAttachmentsQueue());

            window.removeEventListener('beforeunload', alertUser);

            if (isGenericForm) {
              if (
                productArea === FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW
              ) {
                locationAssign('/forms/form_answers_sets');
              } else {
                locationAssign('/forms/my_forms');
              }
            }
          }
        } catch {
          showErrorToast({
            translatedTitle: i18n.t('Unable to submit the form. Try again'),
          });
        }

        setIsSaving(false);
      }
    },
    [
      onBulkCreate,
      formAnswerSetId,
      formAnswers,
      formId,
      userId,
      organisationId,
      fullFormValidationStatus,
      productArea,
      isGenericForm,
      showErrorToast,
      showSuccessToast,
      dispatch,
      trackOnCreateEvents,
      locationAssign,
    ]
  );

  const saveProgressInCreateModeButton = (
    <Button
      key="saveProgress"
      color="secondary"
      disabled={isSaving || isLoading || isAutosaving}
      // This will be changed in the future, once create mode is used
      onClick={() => onCreate({ isSavingProgress: true })}
      sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      size="small"
    >
      {isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SaveAs} />
      ) : (
        saveProgressButtonText
      )}
    </Button>
  );

  const submitButton = (
    <Button
      key="submit"
      onClick={onCreate}
      disabled={isSubmitButtonDisabled}
      size="small"
      sx={{ px: { sm: 0 } }}
    >
      {isMobileView ? (
        <KitmanIcon name={KITMAN_ICON_NAMES.SendOutlined} />
      ) : (
        i18n.t('Submit')
      )}
    </Button>
  );

  const isDraftModeFFOn = window.featureFlags['form-renderer-draft-mode'];
  const shouldShowSaveProgressButton = isDraftModeFFOn && isGenericForm;

  const actionButtons = [];

  const handleAthleteProfileActions = () => {
    switch (mode) {
      case MODES.CREATE:
        // NOTE: There is an org preference we need to assess:
        // hide_athlete_create_button
        if (doesUserHaveRequiredPermissions) {
          actionButtons.push(submitButton);
          actionButtons.push(cancelButton);
        }
        break;
      case MODES.EDIT:
        if (doesUserHaveRequiredPermissions) {
          actionButtons.push(saveButton);
          actionButtons.push(cancelButton);
        }
        break;
      case MODES.VIEW:
        if (doesUserHaveRequiredPermissions) {
          actionButtons.push(editButton);
        }
        break;
      default:
        break;
    }
  };

  const handleGenericFormsStaffFlowActions = () => {
    switch (mode) {
      case MODES.CREATE:
        if (permissions.eforms.canSubmitForms) {
          if (shouldShowSaveProgressButton) {
            actionButtons.push(saveProgressInCreateModeButton);
          }
          actionButtons.push(submitButton);
        }
        break;
      case MODES.EDIT:
        if (
          permissions.eforms.canEditForms ||
          formStatus === FORM_STATUS.DRAFT
        ) {
          if (
            shouldShowSaveProgressButton &&
            formStatus === FORM_STATUS.DRAFT
          ) {
            actionButtons.push(saveProgressInEditModeButton);
          }
          actionButtons.push(saveButton);
        }
        break;
      case MODES.VIEW:
        if (
          permissions.eforms.canEditForms ||
          formStatus === FORM_STATUS.DRAFT
        ) {
          actionButtons.push(editButton);
        }
        break;
      default:
        break;
    }
  };

  const handleGenericFormsAthleteFlowActions = () => {
    const {
      can_edit_submitted_forms: canEditSubmittedFormsTemplateConfig = false,
      can_save_drafts: canSaveDraftsTemplateConfig,
    } = formTemplateSettingsConfig ?? {};

    switch (mode) {
      case MODES.CREATE:
        if (shouldShowSaveProgressButton && canSaveDraftsTemplateConfig) {
          actionButtons.push(saveProgressInCreateModeButton);
        }
        actionButtons.push(submitButton);

        break;
      case MODES.EDIT:
        // Athlete can save an existing form if the template config allows it or if the form is in draft status
        if (
          canEditSubmittedFormsTemplateConfig ||
          formStatus === FORM_STATUS.DRAFT
        ) {
          if (shouldShowSaveProgressButton && canSaveDraftsTemplateConfig) {
            actionButtons.push(saveProgressInEditModeButton);
          }
          actionButtons.push(saveButton);
        }
        break;
      case MODES.VIEW:
        // Athlete can edit a form if the template config allows it or if the form is in draft status
        if (
          canEditSubmittedFormsTemplateConfig ||
          formStatus === FORM_STATUS.DRAFT
        ) {
          actionButtons.push(editButton);
        }
        break;
      default:
        break;
    }
  };

  switch (productArea) {
    case FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW:
      handleGenericFormsStaffFlowActions();
      break;
    case FORMS_PRODUCT_AREAS.GENERIC_FORMS_ATHLETE_FLOW:
      handleGenericFormsAthleteFlowActions();
      break;
    case FORMS_PRODUCT_AREAS.ATHLETE_PROFILE:
    default:
      handleAthleteProfileActions();
      break;
  }

  return {
    actionButtons,
    isSaving,
  };
};

export default useActionButtons;
