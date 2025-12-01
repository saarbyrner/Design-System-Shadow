// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import getDiagnosticResults from '../../services/getDiagnosticResults';
import type { DiagnosticResultsBlockList, RequestStatus } from '../../types';

export type DiagnosticResultsContextType = {
  resultBlocks: DiagnosticResultsBlockList,
  requestStatus: ?'SUCCESS' | 'PENDING' | 'FAILURE',
};
export const DEFAULT_CONTEXT_VALUE = {
  resultBlocks: {},
  requestStatus: 'PENDING',
};
const DiagnosticResultsContext = createContext<DiagnosticResultsContextType>(
  DEFAULT_CONTEXT_VALUE
);
type Props = {
  children: Node,
  diagnosticId: number,
};
const DiagnosticResultsContextProvider = (props: Props) => {
  const [resultBlocks, setResultBlocks] = useState<DiagnosticResultsBlockList>(
    {}
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    getDiagnosticResults(props.diagnosticId).then(
      (diagnosticResultsData: DiagnosticResultsBlockList) => {
        setResultBlocks(diagnosticResultsData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const diagnosticResultsValue = {
    resultBlocks,
    requestStatus,
  };

  return (
    <DiagnosticResultsContext.Provider value={diagnosticResultsValue}>
      {props.children}
    </DiagnosticResultsContext.Provider>
  );
};

const useDiagnosticResults = () => useContext(DiagnosticResultsContext);
export { DiagnosticResultsContextProvider, useDiagnosticResults };
export default DiagnosticResultsContext;
