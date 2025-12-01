// @flow
import { useSelector, useDispatch } from 'react-redux';

import {
  getRequirementById,
  getUserId,
  getRegistrationProfileStatus,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { USER_TYPES } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { getIsPanelOpen } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  type MultiRegistration,
  type RegistrationStatus,
  type RegistrationHistory,
  type UserType,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';

import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationHistorySlice';
import { useLeagueOperations } from '@kitman/common/src/hooks';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isVisible: boolean,
  isDisabled: boolean,
  history: RegistrationHistory,
  onOpenPanel: (isOpen: boolean) => void,
};

const useRegistrationHistory = (): ReturnType => {
  const dispatch = useDispatch();
  const { isLeague } = useLeagueOperations();
  const userId: number = useSelector(getUserId);
  const isOpen: boolean = useSelector(getIsPanelOpen);

  const registrationStatus: RegistrationStatus = useSelector(
    getRegistrationProfileStatus()
  );
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );
  const skipFetchHistoryToken =
    !userId || !currentRequirement || isOpen === false;

  const {
    data: registrationHistory,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useFetchRegistrationHistoryQuery(
    {
      user_id: userId,
      id: currentRequirement?.id,
    },
    { skip: skipFetchHistoryToken }
  );

  const isDisabled = registrationStatus === RegistrationStatusEnum.INCOMPLETE;

  const handleOpenPanel = (val: boolean) => {
    dispatch(onTogglePanel({ isOpen: val }));
  };

  return {
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    history: registrationHistory,
    // TODO: This will need to be updating once we have BE work to determine if current user can create registrations.
    // league admin should always see the history btn OR if current user can create registrations
    isVisible: window.featureFlags['league-ops-update-registration-status']
      ? isLeague || currentUserType === USER_TYPES.ORGANISATION_ADMIN
      : !!window.featureFlags['league-ops-registration-v2-view-history'],
    isDisabled,
    onOpenPanel: handleOpenPanel,
  };
};
export default useRegistrationHistory;
