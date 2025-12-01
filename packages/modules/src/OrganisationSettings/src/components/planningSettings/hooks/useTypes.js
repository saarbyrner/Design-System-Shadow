// @flow
import { useState, useEffect } from 'react';
import getTypes from '@kitman/modules/src/PlanningHub/src/services/getTypes';
import type { RequestStatus } from '@kitman/common/src/types';
import type { PrincipleTypes } from '@kitman/common/src/types/Principles';

const useTypes = () => {
  const [types, setTypes] = useState<PrincipleTypes>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    getTypes().then(
      (fetchedTypes) => {
        setRequestStatus('SUCCESS');
        setTypes(fetchedTypes);
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  return {
    types,
    requestStatus,
  };
};

export default useTypes;
