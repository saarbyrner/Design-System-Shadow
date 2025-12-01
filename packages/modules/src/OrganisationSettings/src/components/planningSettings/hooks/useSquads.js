// @flow
import { useState, useEffect } from 'react';
import { getSquads } from '@kitman/services';
import type { RequestStatus } from '@kitman/common/src/types';
import type { Squads } from '@kitman/services/src/services/getSquads';

const useSquads = () => {
  const [squads, setSquads] = useState<Squads>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    getSquads().then(
      (fetchedSquads) => {
        setSquads(fetchedSquads);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  return {
    squads,
    requestStatus,
  };
};

export default useSquads;
