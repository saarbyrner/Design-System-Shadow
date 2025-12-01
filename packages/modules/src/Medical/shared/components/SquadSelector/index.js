// @flow
import { useEffect } from 'react';
import { Select } from '@kitman/components';
import type { RequestStatus } from '@kitman/common/src/types';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useLazyGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

type Props = {
  label: string,
  athleteId: ?(string | number),
  value: ?number,
  onChange: (squadId: ?number) => void,
  prePopulate?: boolean,
  isOpen?: boolean,
  isInvalid?: boolean,
  requestStatus?: ?RequestStatus,
  fullWidth?: boolean,
};

const SquadSelector = ({
  label,
  athleteId,
  value,
  onChange,
  prePopulate = false,
  isInvalid = false,
  isOpen = false,
  requestStatus,
  fullWidth = false,
}: Props) => {
  const {
    data: permittedSquads = [],
    isLoading: arePermittedSquadsLoading,
    isSuccess: isPermittedSquadsSuccess,
  } = useGetPermittedSquadsQuery();

  const [trigger, getAthletesDataResult] = useLazyGetAthleteDataQuery();

  const athleteSquadNames = getAthletesDataResult?.data?.squad_names || [];
  const athleteSquads =
    athleteSquadNames.filter((athleteSquad) =>
      permittedSquads
        .map((permittedSquad) => permittedSquad.id)
        .includes(athleteSquad.id)
    ) || [];

  useEffect(() => {
    if (!athleteId) {
      return;
    }
    trigger(athleteId);
  }, [athleteId]);

  useEffect(() => {
    if (
      !isOpen ||
      !prePopulate ||
      !isPermittedSquadsSuccess ||
      getAthletesDataResult.status !== 'fulfilled'
    ) {
      return;
    }

    // pre-populate if only one athlete squad
    if (athleteSquads.length === 1) {
      onChange(athleteSquads[0].id);
    }
    // pre-populate if only one user squad
    else if (permittedSquads.length === 1) {
      onChange(permittedSquads[0].id);
    } else if (athleteSquads > 1 || permittedSquads.length > 1) {
      onChange(null);
    }
  }, [getAthletesDataResult.status, isOpen]);

  const userSquads =
    permittedSquads.map((permittedSquad) => ({
      label: permittedSquad.name,
      value: permittedSquad.id,
    })) || [];

  return (
    <Select
      label={label}
      onChange={(squadId) => {
        onChange(squadId);
      }}
      value={value}
      options={userSquads}
      isDisabled={
        requestStatus === 'PENDING' ||
        arePermittedSquadsLoading ||
        getAthletesDataResult.isFetching
      }
      invalid={isInvalid}
      showAutoWidthDropdown={fullWidth}
      isSearchable
      appendToBody
    />
  );
};

export default SquadSelector;
