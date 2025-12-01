// @flow
import { useEffect } from 'react';
import type { SetState } from '@kitman/common/src/types/react';
import type { RequestStatus, Dispatch } from '@kitman/common/src/types';
import type { FormAction } from './useDiagnosticForm';
import getCurrentDiagnostic from '../../../services/getCurrentDiagnostic';

type Params = {
  isRedoxOrg: boolean,
  isOpen: boolean,
  athleteId?: ?number,
  diagnosticId?: ?number,
  setRequestStatus: SetState<RequestStatus>,
  dispatch: Dispatch<FormAction>,
};

const useLoadNonRedoxDiagnostic = ({
  isRedoxOrg,
  isOpen,
  athleteId,
  diagnosticId,
  setRequestStatus,
  dispatch,
}: Params) => {
  useEffect(() => {
    if (
      !isRedoxOrg &&
      isOpen &&
      typeof athleteId === 'number' &&
      typeof diagnosticId === 'number'
    ) {
      setRequestStatus('PENDING');
      // $FlowFixMe[incompatible-type] refined via typeof check above
      const loadedAthleteId: number = (athleteId: any);
      // $FlowFixMe[incompatible-type] refined via typeof check above
      const loadedDiagnosticId: number = (diagnosticId: any);
      getCurrentDiagnostic(loadedAthleteId, loadedDiagnosticId)
        .then((diagnosticData) => {
          dispatch({
            type: 'SET_DIAGNOSTIC_TO_UPDATE',
            diagnosticToUpdate: diagnosticData,
          });
          setRequestStatus(null);
        })
        .catch(() => setRequestStatus('FAILURE'));
    }
  }, [isOpen, athleteId, diagnosticId, isRedoxOrg, dispatch, setRequestStatus]);
};

export default useLoadNonRedoxDiagnostic;

