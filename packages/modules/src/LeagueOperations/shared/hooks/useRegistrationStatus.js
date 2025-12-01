// @flow
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { SelectOption } from '@kitman/components/src/types';
import {
  getPanelFormSectionId,
  getRequirementById,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  useFetchApplicationStatusesQuery,
  useFilterByRegistrationStatusQuery,
  useFetchSectionStatusesQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi';
import { statusTypeOptions } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_options';
import type { MultiRegistration } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { onSetApplicationStatuses } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationApprovalSlice';
import { onSetSectionStatuses } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';

type ReturnType = {
  registrationFilterStatuses: Array<SelectOption>,
  sectionStatuses: Array<SelectOption>,
  registrationApplicationStatus: Array<SelectOption>,
  isLoadingRegistrationFilterStatusesData: boolean,
  isErrorRegistrationFilterStatusesData: boolean,
  isSuccessRegistrationFilterStatuses: boolean,
  isSuccessSectionStatuses: boolean,
  isSuccessRegistrationApplicationStatuses: boolean,
};

type Props = {
  permissionGroup?: string,
};

const transformStatusData = (data: Array<any>): Array<SelectOption> => {
  return data.map((status) => ({
    id: status.id,
    value: status.type,
    label: status.name,
  }));
};

const useRegistrationStatus = ({ permissionGroup }: Props): ReturnType => {
  const dispatch = useDispatch();
  const [registrationFilterStatuses, setRegistrationFilterStatuses] = useState([
    statusTypeOptions[1],
  ]);
  const [sectionStatuses, setSectionStatuses] = useState([
    statusTypeOptions[1],
  ]);
  const [registrationApplicationStatus, setRegistrationApplicationStatus] =
    useState([statusTypeOptions[1]]);

  const sectionId = useSelector(getPanelFormSectionId);
  const CurrentUserId: number = useSelector(getUserId);
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );
  const userId = parseInt(CurrentUserId, 10);
  const registrationId = parseInt(currentRequirement?.id, 10);

  // (by adding the sectionId to the skip prop) ensures the query does not fire when selecting a requirement section
  // (by adding the permissionGroup to the skip prop) ensures the query does not fire when selecting the athlete or staff tabs
  const {
    data: registrationApplicationStatusesData,
    isSuccess: isSuccessRegistrationApplicationStatuses,
  } = useFetchApplicationStatusesQuery(
    { userId, registrationId },
    {
      skip:
        !userId ||
        !registrationId ||
        sectionId ||
        permissionGroup ||
        !window.featureFlags['league-ops-update-registration-status'],
    }
  );

  const { data: sectionStatusesData, isSuccess: isSuccessSectionStatuses } =
    useFetchSectionStatusesQuery(
      { userId, sectionId, registrationId },
      {
        skip:
          !sectionId ||
          !userId ||
          !registrationId ||
          !window.featureFlags['league-ops-update-registration-status'],
      }
    );

  const {
    data: filterByRegistrationStatusData,
    isLoading: isLoadingRegistrationFilterStatusesData,
    isError: isErrorRegistrationFilterStatusesData,
    isSuccess: isSuccessRegistrationFilterStatuses,
  } = useFilterByRegistrationStatusQuery(
    { permissionGroup },
    {
      skip:
        !permissionGroup ||
        !window.featureFlags['league-ops-update-registration-status'],
    }
  );

  const updateStatus = useCallback((data, setStatus) => {
    if (data) {
      setStatus(transformStatusData(data));
    }
  }, []);

  useEffect(() => {
    if (isSuccessRegistrationFilterStatuses) {
      updateStatus(
        filterByRegistrationStatusData,
        setRegistrationFilterStatuses
      );
      dispatch(
        onSetApplicationStatuses({
          statuses: filterByRegistrationStatusData,
        })
      );
    }
  }, [filterByRegistrationStatusData, isSuccessRegistrationFilterStatuses]);

  useEffect(() => {
    if (isSuccessSectionStatuses) {
      updateStatus(sectionStatusesData, setSectionStatuses);
      dispatch(onSetSectionStatuses({ statuses: sectionStatusesData }));
    }
  }, [sectionStatusesData, isSuccessSectionStatuses]);

  useEffect(() => {
    if (isSuccessRegistrationApplicationStatuses) {
      updateStatus(
        registrationApplicationStatusesData,
        setRegistrationApplicationStatus
      );
      dispatch(
        onSetApplicationStatuses({
          statuses: registrationApplicationStatusesData,
        })
      );
    }
  }, [
    registrationApplicationStatusesData,
    isSuccessRegistrationApplicationStatuses,
  ]);

  return {
    registrationFilterStatuses,
    sectionStatuses,
    registrationApplicationStatus,
    isLoadingRegistrationFilterStatusesData,
    isErrorRegistrationFilterStatusesData,
    isSuccessRegistrationFilterStatuses,
    isSuccessSectionStatuses,
    isSuccessRegistrationApplicationStatuses,
  };
};

export default useRegistrationStatus;
