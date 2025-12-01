// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import getCurrentProcedure from '@kitman/services/src/services/medical/getCurrentProcedure';
import type { ProcedureResponseData } from '@kitman/modules/src/Medical/shared/types/medical';
import type { RequestStatus } from '../../types';

export type ProcedureContextType = {
  procedure: ProcedureResponseData,
  requestStatus: ?string,
  updateProcedure: (_: ProcedureResponseData) => void,
};

export const DEFAULT_CONTEXT_VALUE = {
  procedure: {},
  requestStatus: 'PENDING',
  updateProcedure: () => {},
};

const ProcedureContext = createContext<ProcedureContextType>(
  DEFAULT_CONTEXT_VALUE
);

type Props = {
  children: Node,
  procedureId: number,
};
const ProcedureContextProvider = (props: Props) => {
  const [procedure, setProcedure] = useState<ProcedureResponseData>({});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    getCurrentProcedure(props.procedureId).then(
      (procedureData: ProcedureResponseData) => {
        setProcedure(procedureData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const updateProcedure = (updatedProcedure: ProcedureResponseData) => {
    setProcedure(() => updatedProcedure);
  };

  const procedureValue = {
    procedure,
    requestStatus,
    updateProcedure,
  };

  return (
    <ProcedureContext.Provider value={procedureValue}>
      {props.children}
    </ProcedureContext.Provider>
  );
};

const useProcedure = () => useContext(ProcedureContext);
export { ProcedureContextProvider, useProcedure };
export default ProcedureContext;
