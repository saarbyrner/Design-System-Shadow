// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import React from 'react';
import DiagnosticTabFormContext from '../DiagnosticTabFormContext';
import type { DiagnosticTabFormContextType } from '../DiagnosticTabFormContext';

export const MockedDiagnosticTabFormStateContext = {
  diagnosticTabFormState: {
    isEditing: false,
    queuedReconciledDiagnostics: [],
  },
  updateQueuedReconciledDiagnostics: () => {},
  clearQueuedReconciledDiagnostics: () => {},
};

type MockedDiagnosticContextProviderType = {
  diagnosticTabFormStateContext: DiagnosticTabFormContextType,
  children: Node,
};
// Mocking reacts useContext to return the context
export const mockDiagnosticTabContext = (
  permissionsContext: MockedDiagnosticContextProviderType
) => {
  sinon.stub(React, 'useContext').returns(permissionsContext);
};
export const MockedDiagnosticTabFormStateContextProvider = ({
  diagnosticTabFormStateContext,
  children,
}: MockedDiagnosticContextProviderType) => (
  <DiagnosticTabFormContext.Provider value={diagnosticTabFormStateContext}>
    {children}
  </DiagnosticTabFormContext.Provider>
);
