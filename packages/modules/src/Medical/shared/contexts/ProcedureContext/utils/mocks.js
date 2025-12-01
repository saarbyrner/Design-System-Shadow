// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import data from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import ProcedureContext from '..';
import * as ProcedureContextItems from '..';
import type { ProcedureContextType } from '..';

const mockedProcedure = data.procedures[0];

export const mockedProcedureContextValue = {
  procedure: mockedProcedure,
  requestStatus: 'SUCCESS',
};

type MockedProcedureContextProviderType = {
  procedureContext: ProcedureContextType,
  children: Node,
};

export const MockedProcedureContextProvider = ({
  procedureContext,
  children,
}: MockedProcedureContextProviderType) => (
  <ProcedureContext.Provider value={procedureContext}>
    {children}
  </ProcedureContext.Provider>
);

export const mockedUseProcedure = (procedureContext: ProcedureContextType) => {
  sinon.stub(ProcedureContextItems, 'useProcedure').returns(procedureContext);
};

export const cleanUpMockIssue = () => {
  try {
    // $FlowIgnore designed to be used on stub created above
    ProcedureContextItems.useProcedure.restore();
  } catch (e) {
    // Empty catch block as .restore() may not
    // be defined if there was an issue with the stub
    // so this catches that error. There is no need to do
    // anything with the error
  }
};
