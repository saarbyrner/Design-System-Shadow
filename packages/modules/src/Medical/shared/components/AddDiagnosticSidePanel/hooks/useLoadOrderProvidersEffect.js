// @flow
import { useEffect } from 'react';
import type { OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';
import { getOrderProviders } from '@kitman/services';
import type { Dispatch, RequestStatus } from '@kitman/common/src/types';
import type { SetState } from '@kitman/common/src/types/react';
import type { FormAction } from './useDiagnosticForm';

type Params = {
  isEditing: boolean,
  diagnosticToUpdate: ?{ location?: { id?: number } },
  dispatch: Dispatch<FormAction>,
  setOrderProviders: SetState<OrderProviderType>,
  setRequestStatus: SetState<RequestStatus>,
  isOpen: boolean,
};

const useLoadOrderProvidersEffect = ({
  isEditing,
  diagnosticToUpdate,
  dispatch,
  setOrderProviders,
  setRequestStatus,
  isOpen,
}: Params) => {
  useEffect(() => {
    if (isEditing && diagnosticToUpdate) {
      const locationIdStr =
        diagnosticToUpdate?.location?.id != null
          ? String(diagnosticToUpdate.location.id)
          : undefined;
      getOrderProviders({
        locationId: locationIdStr,
        activeUsersOnly: true,
        npi: true,
      })
        .then((orderProviderData) => {
          setOrderProviders(orderProviderData);
        })
        .catch(() => {
          setRequestStatus('FAILURE');
        });
      dispatch({
        type: 'SET_DIAGNOSTIC_TO_UPDATE',
        diagnosticToUpdate,
      });
    }
  }, [isOpen, isEditing, diagnosticToUpdate]);
};

export default useLoadOrderProvidersEffect;
