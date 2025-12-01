// @flow
import { useState } from 'react';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  DeletionAvailability,
  DeletableItemId,
} from '@kitman/common/src/types/DeletionAvailability';

const useDeletionAvailability = () => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [deletableItemId, setDeletableItemId] = useState<DeletableItemId>(0);
  const [deletionAvailability, setDeletionAvailability] =
    useState<DeletionAvailability>({});

  const getDeletionAvailability = (
    getRequest: Function,
    itemId: DeletableItemId
  ): Promise<void> =>
    new Promise<void>((resolve: (value: any) => void) => {
      setRequestStatus('PENDING');
      getRequest(itemId).then(
        (currentDeletionAvailability) => {
          if (currentDeletionAvailability.ok) {
            setDeletableItemId(itemId);
          }
          resolve();
          setRequestStatus('SUCCESS');
          setDeletionAvailability(currentDeletionAvailability);
        },
        () => setRequestStatus('FAILURE')
      );
    });

  return {
    requestStatus,
    deletableItemId,
    getDeletionAvailability,
    deletionAvailability,
  };
};

export default useDeletionAvailability;
