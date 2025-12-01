// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import {
  getRequirementById,
  getUserId,
  getRegistrationProfileStatus,
  getRegistrationSystemStatusForCurrentRequirement,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import {
  getSelectedApprovalStatus,
  getSelectedApprovalAnnotation,
  getIsSubmitDisabledFactory,
  getRegistrationFormStatus,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors';
import {
  type MultiRegistration,
  type RegistrationStatus,
  type RegistrationSystemStatus,
  type UserType,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import { useFetchRequirementSectionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import { useUpdateRegistrationStatusMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';

import {
  onTogglePanel,
  onSetApprovalStatus,
  onSetApprovalAnnotation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationApprovalSlice';

import {
  getApprovalOptions,
  type ApprovalOption,
} from '@kitman/modules/src/LeagueOperations/technicalDebt';

import type { Args as UpdateStatusArgs } from '../../../services/updateRegistrationStatus';
import useFormToasts from '../../../hooks/useFormToasts';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isApproveVisible: boolean,
  isApproveDisabled: boolean,
  isSubmitStatusDisabled: boolean,
  approvalOptions: Array<ApprovalOption>,
  onOpenPanel: (isOpen: boolean) => void,
  onApproveRegistration: () => Promise<void>,
  onApplyStatus: ({ status: RegistrationStatus }) => void,
  onAddAnnotation: ({ annotation: string }) => void,
};

const useApproveRegistration = (): ReturnType => {
  const dispatch = useDispatch();
  const userId: number = useSelector(getUserId);
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );
  const registrationStatus: RegistrationStatus = useSelector(
    getRegistrationProfileStatus()
  );

  const registrationSystemStatus: RegistrationSystemStatus = useSelector(
    getRegistrationSystemStatusForCurrentRequirement()
  );

  const formStatus = useSelector(getRegistrationFormStatus());
  const userType: UserType = useSelector(getRegistrationUserTypeFactory());

  const {
    data: requirementsData,
    isLoading: isRequirementsDataLoading,
    isError: isRequirementsDataError,
  } = useFetchRequirementSectionsQuery(
    {
      search_expression: '',
      per_page: 30,
      page: 1,
      registration_id: currentRequirement?.id,
      user_id: userId,
    },
    { skip: !userId || !currentRequirement?.id }
  );

  const newStatus = useSelector(getSelectedApprovalStatus);
  const newAnnotation = useSelector(getSelectedApprovalAnnotation);
  const isSubmitStatusDisabled = useSelector(getIsSubmitDisabledFactory());

  const isApproveButtonVisible = (): boolean => {
    return ![ATHLETE, STAFF].includes(userType);
  };

  const isApproveDisabled = () => {
    if (
      [
        RegistrationStatusEnum.APPROVED,
        RegistrationStatusEnum.UNAPPROVED,
      ].includes(registrationSystemStatus.type)
    )
      return true;
    if ([ATHLETE, STAFF].includes(userType)) return true;
    if (userType === ASSOCIATION_ADMIN) {
      return false; // enable the button if registration status is NOT approved
    }
    if (
      userType === ORGANISATION_ADMIN &&
      registrationSystemStatus.type ===
        RegistrationStatusEnum.PENDING_ASSOCIATION
    ) {
      return true;
    }
    return !requirementsData?.data?.every((item) =>
      [
        RegistrationStatusEnum.PENDING_ASSOCIATION,
        RegistrationStatusEnum.APPROVED,
      ].includes(item.registration_system_status.type)
    );
  };

  const {
    onUpdateRegistrationFailureToast,
    onUpdateRegistrationPendingToast,
    onUpdateRegistrationSuccessToast,
    onClearUpdateRegistrationToasts,
  } = useFormToasts();

  const [
    onUpdateRegistrationStatus,
    {
      isLoading: isUpdateRegistrationStatusLoading,
      isError: hasUpdateRegistrationFailed,
      isSuccess: isUpdateRegistrationSuccess,
    },
  ] = useUpdateRegistrationStatusMutation();

  useEffect(() => {
    if (isUpdateRegistrationStatusLoading) {
      onClearUpdateRegistrationToasts();
      onUpdateRegistrationPendingToast();
    }
    if (isUpdateRegistrationSuccess) {
      onClearUpdateRegistrationToasts();
      onUpdateRegistrationSuccessToast();
      dispatch(onTogglePanel({ isOpen: false }));
    }
    if (hasUpdateRegistrationFailed) {
      onClearUpdateRegistrationToasts();
      onUpdateRegistrationFailureToast();
    }
  }, [
    isUpdateRegistrationStatusLoading,
    hasUpdateRegistrationFailed,
    isUpdateRegistrationSuccess,
    onUpdateRegistrationFailureToast,
    onUpdateRegistrationPendingToast,
    onUpdateRegistrationSuccessToast,
    onClearUpdateRegistrationToasts,
    dispatch,
  ]);

  const onApproveRegistration = async () => {
    const params: UpdateStatusArgs = {
      user_id: parseInt(userId, 10),
      // $FlowIgnore currentRequirement will be present at this stage
      registration_id: parseInt(currentRequirement.id, 10),
      status: newStatus,
      annotation: newAnnotation,
    };

    // Todo: remove once FF tidy this up once we get the go ahead with passing status id
    const newParams = {
      ...params,
      status: formStatus?.[0]?.type || '',
      registration_system_status_id: formStatus?.[0]?.id || null,
    };
    // eslint-disable-next-line no-unused-expressions
    window.featureFlags['league-ops-update-registration-status']
      ? await onUpdateRegistrationStatus(newParams)
      : await onUpdateRegistrationStatus(params);
  };

  const handleOpenPanel = (val: boolean) => {
    dispatch(onTogglePanel({ isOpen: val }));
  };

  // TODO: update this to use registration_system_status
  const approvalOptions: Array<ApprovalOption> = getApprovalOptions({
    userType,
    currentStatus: registrationStatus,
  });

  // TODO: update this to use registration_system_status
  const onApplyStatus = ({ status }: { status: RegistrationStatus }) => {
    dispatch(onSetApprovalStatus({ status }));
  };

  const onAddAnnotation = ({ annotation }: { annotation: string }) => {
    dispatch(onSetApprovalAnnotation({ annotation }));
  };

  return {
    isLoading: isRequirementsDataLoading || isUpdateRegistrationStatusLoading,
    isError: isRequirementsDataError || hasUpdateRegistrationFailed,
    isApproveVisible: isApproveButtonVisible(),
    isApproveDisabled: isApproveDisabled(),
    isSubmitStatusDisabled,
    onApproveRegistration,
    onOpenPanel: handleOpenPanel,
    onApplyStatus,
    onAddAnnotation,
    approvalOptions,
  };
};
export default useApproveRegistration;
