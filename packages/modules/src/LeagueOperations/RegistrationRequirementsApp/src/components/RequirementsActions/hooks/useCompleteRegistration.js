// @flow

import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import { useLocationAssign } from '@kitman/common/src/hooks';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';

type Params = {
  requirementId: number,
  user: User,
};

type UseCompleteRegistration = {
  isVisible: boolean,
  onClick: () => void,
  isRegistrationExternallyManaged: boolean,
};

const useCompleteRegistration = ({
  requirementId,
  user,
}: Params): UseCompleteRegistration => {
  const locationAssign = useLocationAssign();

  const { data } = useFetchIsRegistrationSubmittableQuery({
    requirementId,
    userId: user?.id,
  });

  const onClick = () => {
    locationAssign(`/registration/complete${window.location.search}`);
  };

  const currentRequirementRegistrationSystemStatus = user?.registrations?.find(
    (registration) =>
      registration?.registration_requirement.id === requirementId
  )?.registration_system_status;

  const isRegistrationStatusNotComplete =
    currentRequirementRegistrationSystemStatus === null ||
    currentRequirementRegistrationSystemStatus?.type ===
      RegistrationStatusEnum.INCOMPLETE;

  const isRegistrationExternallyManaged = data?.externally_managed ?? false;

  const canCompleteRegistration =
    data?.registration_completable &&
    isRegistrationStatusNotComplete &&
    !user?.non_registered;

  return {
    onClick,
    isVisible: canCompleteRegistration,
    isRegistrationExternallyManaged,
  };
};

export { useCompleteRegistration };
