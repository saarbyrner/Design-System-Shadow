// @flow

import { useCallback } from 'react';
import { Button } from '@kitman/playbook/components';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import type { Node } from 'react';
import {
  onSetMode,
  onSetFormAnswersSet,
  onSetFormStructure,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import {
  getModeFactory,
  getFormAnswersFactory,
  getFormAnswerSetIdFactory,
  getElementsFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  useCreateStaffProfileMutation,
  useUpdateStaffProfileMutation,
} from '@kitman/modules/src/StaffProfile/shared/redux/services';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  createFormAnswersRequestBody,
  validateElement,
} from '@kitman/modules/src/HumanInput/shared/utils';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useCancelFormEdit } from '@kitman/modules/src/HumanInput/hooks/helperHooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

export const STAFF_PROFILE_ERROR_TOAST_ID = 'STAFF_PROFILE_ERROR_TOAST';
export const STAFF_PROFILE_SUCCESS_TOAST_ID = 'STAFF_PROFILE_SUCCESS_TOAST';

export type ReturnType = {
  actionButtons: Node[],
};
const getValidationErrorText = () => i18n.t('Please fill in required fields');
const getSavingErrorText = () => i18n.t('Unable to save. Try again');

const useActionButtons = (): ReturnType => {
  const dispatch = useDispatch();
  const mode = useSelector(getModeFactory());
  const formAnswerSetId = useSelector(getFormAnswerSetIdFactory());
  const formAnswers = useSelector(getFormAnswersFactory());
  const fullFormValidationStatus = useStatus({
    fields: Object.keys(formAnswers).map(Number),
  });
  const locationAssign = useLocationAssign();
  const locationPathname = useLocationPathname();
  const staffId = parseInt(locationPathname.split('/')[3], 10);
  const [createStaffProfile, { isLoading: isCreateLoading }] =
    useCreateStaffProfileMutation();
  const [updateStaffProfile, { isLoading: isUpdateLoading }] =
    useUpdateStaffProfileMutation();

  const formStructureElements = useSelector(getElementsFactory());

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: STAFF_PROFILE_ERROR_TOAST_ID,
    successToastId: STAFF_PROFILE_SUCCESS_TOAST_ID,
  });
  const { onCancelFormEdit } = useCancelFormEdit(mode);

  const { permissions } = usePermissions();

  const cancelButton = (
    <Button
      key="cancel"
      color="secondary"
      variant="contained"
      onClick={onCancelFormEdit}
      disabled={mode === MODES.VIEW || isUpdateLoading}
      sx={{ ml: 0.5 }}
    >
      {i18n.t('Cancel')}
    </Button>
  );

  const validateFullForm = useCallback(() => {
    Object.values(formStructureElements).forEach(
      // $FlowIgnore[incompatible-call]
      (element: HumanInputFormElement) => {
        const value = formAnswers[element.id];
        const { status, message } = validateElement(element, value);

        dispatch(
          onUpdateValidation({
            [element.id]: {
              status,
              message,
            },
          })
        );
      }
    );
  }, [dispatch, formAnswers, formStructureElements]);

  const onCreate = useCallback(async () => {
    validateFullForm();

    if (fullFormValidationStatus === 'INVALID') {
      showErrorToast({ translatedTitle: getValidationErrorText() });
    } else {
      const { answers } = createFormAnswersRequestBody(
        formAnswerSetId,
        formAnswers
      );

      createStaffProfile({ requestBody: { answers } })
        .unwrap()
        .then((data) => {
          if (data) {
            showSuccessToast({
              translatedTitle: i18n.t('Staff user has been created'),
            });

            locationAssign(`/administration/staff/${data.user?.id}`);
          }
        })
        .catch(() => {
          showErrorToast({ translatedTitle: getSavingErrorText() });
        });
    }
  }, [
    validateFullForm,
    fullFormValidationStatus,
    showSuccessToast,
    showErrorToast,
    createStaffProfile,
    formAnswerSetId,
    formAnswers,
    locationAssign,
  ]);

  const createButton = (
    <Button
      key="create"
      variant="contained"
      onClick={onCreate}
      disabled={isCreateLoading}
    >
      {i18n.t('Create')}
    </Button>
  );

  const editButton = (
    <Button
      key="edit"
      variant="contained"
      onClick={() => dispatch(onSetMode({ mode: MODES.EDIT }))}
    >
      {i18n.t('Edit')}
    </Button>
  );

  const onSave = useCallback(async () => {
    if (fullFormValidationStatus === 'INVALID') {
      showErrorToast({ translatedTitle: getValidationErrorText() });
    } else {
      const requestBody = createFormAnswersRequestBody(
        formAnswerSetId,
        formAnswers
      );

      updateStaffProfile({
        staffId,
        requestBody,
      })
        .unwrap()
        .then((data) => {
          if (data) {
            showSuccessToast({
              translatedTitle: i18n.t('Staff user has been updated'),
            });

            // update form answers set from the response
            dispatch(
              onSetFormAnswersSet({
                formAnswers: data.form_answers,
              })
            );

            // update for structure (to update header/user full name data)
            dispatch(
              onSetFormStructure({
                structure: data,
              })
            );

            dispatch(onSetMode({ mode: MODES.VIEW }));
          }
        })
        .catch(() => {
          showSuccessToast({ translatedTitle: getSavingErrorText() });
        });
    }
  }, [
    dispatch,
    fullFormValidationStatus,
    showErrorToast,
    showSuccessToast,
    formAnswerSetId,
    formAnswers,
    staffId,
    updateStaffProfile,
  ]);

  const saveButton = (
    <Button
      key="save"
      variant="contained"
      onClick={onSave}
      disabled={isUpdateLoading}
    >
      {i18n.t('Save')}
    </Button>
  );

  const actionButtons = [];

  if (permissions.settings.canManageStaffUsers) {
    switch (mode) {
      case MODES.CREATE:
        actionButtons.push(createButton);

        break;
      case MODES.EDIT:
        actionButtons.push(saveButton);
        actionButtons.push(cancelButton);

        break;
      case MODES.VIEW:
        actionButtons.push(editButton);
        break;

      default:
        break;
    }
  }

  return {
    actionButtons,
  };
};

export default useActionButtons;
