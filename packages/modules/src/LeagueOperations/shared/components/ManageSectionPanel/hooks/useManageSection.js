// @flow

import { useSelector, useDispatch } from 'react-redux';
import type {
  RegistrationStatus,
  RegistrationSystemStatus,
  User,
  SectionFormElement,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  Mode,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import { onSetMode } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';

import { getElementByIdFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

import {
  getPanelFormElement,
  getPanelStatus,
  getPanelRegistrationSystemStatus,
  getRegistrationProfile,
  getIsSubmitDisabledFactory,
  getRequirementById,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import { getRegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import {
  canEditSection,
  canApproveRequirement,
} from '@kitman/modules/src/LeagueOperations/shared/utils/operations';
import { getFormFields } from '@kitman/modules/src/HumanInput/shared/utils';
import { INVALID } from '@kitman/modules/src/HumanInput/types/validation';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import {
  getRequirementApprovalOptions,
  type ApprovalOption,
} from '@kitman/modules/src/LeagueOperations/technicalDebt';

import {
  onSetApprovalStatus,
  onSetApprovalAnnotation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';

type ReturnType = {
  isSectionValid: boolean,
  isSectionEditable: boolean,
  isSectionApprovable: boolean,
  onToggleMode: ({ mode: Mode }) => void,
  approvalOptions: Array<ApprovalOption>,
  onApplyStatus: ({ newStatus: RegistrationStatus }) => void,
  onAddAnnotation: ({ annotation: string }) => void,
  isSubmitStatusDisabled: boolean,
};

const useManageSection = (): ReturnType => {
  const dispatch = useDispatch();
  const { userType } = useRegistrationOperations();
  const status: RegistrationStatus = useSelector(getPanelStatus);
  const registrationSystemStatus: RegistrationSystemStatus = useSelector(
    getPanelRegistrationSystemStatus
  );

  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );
  const profile: User = useSelector(getRegistrationProfile);
  const currentRequirement = useSelector(getRequirementById());
  const { data } = useFetchIsRegistrationSubmittableQuery({
    requirementId: currentRequirement.registration_requirement?.id,
    userId: profile?.id,
  });

  const panelElement: SectionFormElement = useSelector(getPanelFormElement);

  const currentSectionForm: HumanInputFormElement = useSelector(
    getElementByIdFactory({
      id: panelElement.id,
      type: LAYOUT_ELEMENTS.MenuItem,
    })
  );

  const sectionElementIds = getFormFields(currentSectionForm.form_elements);

  const sectionStatus =
    useStatus({
      fields: sectionElementIds,
    }) || 'INVALID';

  const isSectionEditable =
    canEditSection({
      registrationSystemStatus,
      isRegistrationCompletable: data?.registration_completable,
    }) || false;

  const isSectionApprovable =
    canApproveRequirement({
      userType,
      registrationSystemStatus,
      registrationPermissions,
      key: profile?.permission_group.toLowerCase(),
    }) || false;

  const onToggleMode = ({ mode }: { mode: Mode }) => {
    return dispatch(onSetMode({ mode }));
  };

  // TODO: update this to use registration_system_status
  const approvalOptions: Array<ApprovalOption> = getRequirementApprovalOptions({
    userType,
    currentStatus: status,
  });

  // TODO: update this to use registration_system_status
  const onApplyStatus = ({ newStatus }: { newStatus: RegistrationStatus }) => {
    dispatch(onSetApprovalStatus({ status: newStatus }));
  };

  const onAddAnnotation = ({ annotation }: { annotation: string }) => {
    dispatch(onSetApprovalAnnotation({ annotation }));
  };

  const isSubmitStatusDisabled =
    useSelector(getIsSubmitDisabledFactory()) ?? true;

  return {
    isSectionValid: sectionStatus !== INVALID,
    isSectionEditable,
    isSectionApprovable,
    onToggleMode,
    approvalOptions,
    onApplyStatus,
    onAddAnnotation,
    isSubmitStatusDisabled,
  };
};

export default useManageSection;
