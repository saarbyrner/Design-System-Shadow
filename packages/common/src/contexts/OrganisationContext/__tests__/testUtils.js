// @flow
import React from 'react';
import type { Node } from 'react';
import sinon from 'sinon';
import OrganisationContext from '..';
import type { OrganisationContextType } from '../types';

// Mocking reacts useContext to return the context
export const mockOrganisationContext = (
  organisationContext: OrganisationContextType
) => {
  sinon.stub(React, 'useContext').returns(organisationContext);
};

export const updateMockContextValues = (
  organisationContext: OrganisationContextType
) => {
  // $FlowIgnore designed to be used on stub created above
  React.useContext.returns(organisationContext);
};

export const cleanUpOrganisationContext = () => {
  try {
    // $FlowIgnore designed to be used on stub created above
    React.useContext.restore();
  } catch (e) {
    // Empty catch block as .restore() may not
    // be defined if there was an issue with the stub
    // so this catches that error. There is no need to do
    // anything with the error
  }
};

type MockedOrganisationContextProviderType = {
  organisationContext: OrganisationContextType,
  children: Node,
};

export const MockedOrganisationContextProvider = ({
  organisationContext,
  children,
}: MockedOrganisationContextProviderType) => (
  // $FlowIgnore designed to be used on stub created above
  <OrganisationContext.Provider value={organisationContext}>
    {children}
  </OrganisationContext.Provider>
);
