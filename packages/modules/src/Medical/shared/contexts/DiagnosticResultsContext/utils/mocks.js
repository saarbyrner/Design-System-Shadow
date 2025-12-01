// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import {
  labData as mockedDiagnosticResults,
  radiologyData as mockedDiagnosticRadiologyResults,
} from '@kitman/services/src/mocks/handlers/medical/getDiagnosticResults';
import DiagnosticResultsContext from '..';
import type { DiagnosticResultsContextType } from '..';

export const mockedDiagnosticResultsContextValue = {
  resultBlocks: { results: mockedDiagnosticResults },
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};
export const mockedDiagnosticRadiologyResultsContextValue = {
  resultBlocks: { results: mockedDiagnosticRadiologyResults },
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
};

type MockedDiagnosticResultsContextProviderType = {
  diagnosticResultsContext: DiagnosticResultsContextType,
  children: Node,
};

export const MockeddiagnosticResultsContextProvider = ({
  diagnosticResultsContext,
  children,
}: MockedDiagnosticResultsContextProviderType) => (
  <DiagnosticResultsContext.Provider value={diagnosticResultsContext}>
    {children}
  </DiagnosticResultsContext.Provider>
);
