// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getRequirementById,
  getUserId,
  getPanelFormElement,
  getPanelFormSectionId,
  getSelectedApprovalStatus,
  getSelectedApprovalAnnotation,
  getRegistrationSectionStatus,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  getElementByIdFactory,
  getFormState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  useUpdateRequirementSectionMutation,
  useApplyRequirementStatusMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi';
import { getRegistrationStatus } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getRegistrationStatus';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { buildFormState } from '../../../HumanInput/shared/utils/form';
import type { Args as UpdateSectionArgs } from '../services/updateRequirementSection';
import type { Args as ApplyStatusArgs } from '../services/applyRequirementStatus';
import useFormToasts from './useFormToasts';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  onUpdate: () => Promise<void>,
  onUpdateStatus: () => Promise<void>,
};

const useUpdateSection = (): ReturnType => {
  const dispatch = useDispatch();
  const userId: number = useSelector(getUserId);
  const currentRequirement = useSelector(getRequirementById());
  const newStatus = useSelector(getSelectedApprovalStatus);
  const sectionStatus = useSelector(getRegistrationSectionStatus());
  const newAnnotation = useSelector(getSelectedApprovalAnnotation);

  const { trackEvent } = useEventTracking();

  const {
    onUpdateSectionSuccessToast,
    onUpdateSectionFailureToast,
    onUpdateSectionPendingToast,
    onClearSectionToasts,
    onApplySectionPendingToast,
    onApplySectionFailureToast,
    onApplySectionSuccessToast,
    onClearApplyStatusToasts,
  } = useFormToasts();

  const panelElement = useSelector(getPanelFormElement);
  const sectionId = useSelector(getPanelFormSectionId);
  const form = useSelector(getFormState);
  const formElement = useSelector(
    getElementByIdFactory({
      id: panelElement.id,
      type: LAYOUT_ELEMENTS.MenuItem,
    })
  );

  const [
    onSaveSection,
    {
      isLoading: isSaveSectionLoading,
      isError: hasSaveSectionFailed,
      isSuccess: isSaveSectionSuccess,
    },
  ] = useUpdateRequirementSectionMutation();

  const [
    onApplyStatus,
    {
      isLoading: isApplyStatusLoading,
      isError: hasApplyStatusFailed,
      isSuccess: isApplyStatusSuccess,
    },
  ] = useApplyRequirementStatusMutation();

  const buildAnswersPayload = () => {
    const sectionFormState = buildFormState(formElement);
    const keys = Object.keys(sectionFormState);
    return keys.map((key) => {
      return {
        form_element_id: parseInt(key, 10),
        value: form[key],
      };
    });
  };

  useEffect(() => {
    onClearSectionToasts();
    if (isSaveSectionLoading) {
      onUpdateSectionPendingToast();
    }
    if (isSaveSectionSuccess) {
      onUpdateSectionSuccessToast();
      trackEvent(
        'Update registration status',
        getRegistrationStatus({ status: currentRequirement.status })
      );
      dispatch(onTogglePanel({ isOpen: false }));
    }
    if (hasSaveSectionFailed) {
      onUpdateSectionFailureToast();
    }
  }, [
    onClearSectionToasts,
    isSaveSectionLoading,
    hasSaveSectionFailed,
    isSaveSectionSuccess,
    onUpdateSectionSuccessToast,
    onUpdateSectionFailureToast,
    onUpdateSectionPendingToast,
    dispatch,
  ]);

  useEffect(() => {
    onClearApplyStatusToasts();
    if (isApplyStatusLoading) {
      onApplySectionPendingToast();
    }
    if (isApplyStatusSuccess) {
      onApplySectionSuccessToast();
      trackEvent(
        'Submit requirement',
        getRegistrationStatus({ status: newStatus, annotation: newAnnotation })
      );
      dispatch(onTogglePanel({ isOpen: false }));
    }
    if (hasApplyStatusFailed) {
      onApplySectionFailureToast();
    }
  }, [
    onClearApplyStatusToasts,
    isApplyStatusLoading,
    hasApplyStatusFailed,
    isApplyStatusSuccess,
    onApplySectionFailureToast,
    onApplySectionPendingToast,
    onApplySectionSuccessToast,
    dispatch,
  ]);

  const onUpdate = async () => {
    const params: UpdateSectionArgs = {
      user_id: parseInt(userId, 10),
      registration_id: parseInt(currentRequirement.id, 10),
      id: sectionId,
      answers: buildAnswersPayload(),
    };

    await onSaveSection(params);
  };

  const onUpdateStatus = async () => {
    const params: ApplyStatusArgs = {
      user_id: parseInt(userId, 10),
      registration_id: parseInt(currentRequirement.id, 10),
      section_id: sectionId,
      status: newStatus,
      annotation: newAnnotation,
    };

    // Todo: remove once FF tidy this up once we get the go ahead with passing status id
    const newParams = {
      ...params,
      status: sectionStatus?.[0]?.type || '',
      registration_system_status_id: sectionStatus?.[0]?.id || null,
    };
    // eslint-disable-next-line no-unused-expressions
    window.featureFlags['league-ops-update-registration-status']
      ? await onApplyStatus(newParams)
      : await onApplyStatus(params);
  };

  return {
    isLoading: isSaveSectionLoading || isApplyStatusLoading,
    isError: hasSaveSectionFailed || hasApplyStatusFailed,
    onUpdate,
    onUpdateStatus,
  };
};
export default useUpdateSection;
