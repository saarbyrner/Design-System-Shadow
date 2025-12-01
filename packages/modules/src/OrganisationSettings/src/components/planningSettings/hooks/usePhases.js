// @flow
import { useState, useEffect } from 'react';
import getPhases from '@kitman/modules/src/PlanningHub/src/services/getPhases';
import type { RequestStatus } from '@kitman/common/src/types';
import type { PrinciplePhases } from '@kitman/common/src/types/Principles';

const usePhases = () => {
  const [phases, setPhases] = useState<PrinciplePhases>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    getPhases().then(
      (fetchedPhases) => {
        setRequestStatus('SUCCESS');
        setPhases(fetchedPhases);
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  return {
    phases,
    requestStatus,
  };
};

export default usePhases;
