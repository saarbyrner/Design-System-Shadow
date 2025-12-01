// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import { data as mockedDiagnostics } from '@kitman/services/src/mocks/handlers/medical/getDiagnostics';
import DiagnosticContext from '..';
import type { DiagnosticContextType } from '..';

export const mockedDiagnosticContextValue = {
  diagnostic: mockedDiagnostics.diagnostics[0],
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

export const mockedCovidDiagnosticContextValue = {
  diagnostic: mockedDiagnostics.diagnostics[3],
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

export const mockedMedicationDiagnosticContextValue = {
  diagnostic: mockedDiagnostics.diagnostics[4],
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

export const mockedDiagnosticWithAnnotationContextValue = {
  diagnostic: mockedDiagnostics.diagnostics[5],
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

export const mockedRedoxDiagnosticContextValue = {
  diagnostic: mockedDiagnostics.diagnostics[6],
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

type MockedDiagnosticContextProviderType = {
  diagnosticContext: DiagnosticContextType,
  children: Node,
};

export const MockedDiagnosticContextProvider = ({
  diagnosticContext,
  children,
}: MockedDiagnosticContextProviderType) => (
  <DiagnosticContext.Provider value={diagnosticContext}>
    {children}
  </DiagnosticContext.Provider>
);
