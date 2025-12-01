// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import getCurrentDiagnostic from '../../services/getCurrentDiagnostic';
import type { Diagnostic, RequestStatus } from '../../types';

export type DiagnosticContextType = {
  diagnostic: Diagnostic,
  requestStatus: ?string,
  updateDiagnostic: (_: Diagnostic) => void,
};
export const DEFAULT_CONTEXT_VALUE = {
  diagnostic: {},
  requestStatus: 'PENDING',
  updateDiagnostic: () => {},
};
const DiagnosticContext = createContext<DiagnosticContextType>(
  DEFAULT_CONTEXT_VALUE
);
type Props = {
  children: Node,
  diagnosticId: number,
  athleteId: number,
};
const DiagnosticContextProvider = (props: Props) => {
  const [diagnostic, setDiagnostic] = useState<Diagnostic>({});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    if (!props.athleteId || !props.diagnosticId) return;
    getCurrentDiagnostic(props.athleteId, props.diagnosticId).then(
      (diagnosticData: Diagnostic) => {
        setDiagnostic(diagnosticData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, [props.athleteId, props.diagnosticId]);

  const updateDiagnostic = (updatedDiagnostic: Diagnostic) => {
    const athlete = diagnostic.athlete;
    setDiagnostic(() => ({ ...updatedDiagnostic, athlete }));
  };

  const diagnosticValue = {
    diagnostic,
    requestStatus,
    updateDiagnostic,
  };

  return (
    <DiagnosticContext.Provider value={diagnosticValue}>
      {props.children}
    </DiagnosticContext.Provider>
  );
};

const useDiagnostic = () => useContext(DiagnosticContext);
export { DiagnosticContextProvider, useDiagnostic };
export default DiagnosticContext;
