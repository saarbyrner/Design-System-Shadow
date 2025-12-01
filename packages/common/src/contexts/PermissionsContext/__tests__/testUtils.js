// @flow
import React from 'react';
import type { Node } from 'react';
import sinon from 'sinon';
import PermissionsContext from '..';
import type { PermissionsContextType } from '../types';

// Mocking reacts useContext to return the context
export const mockPermissionsContext = (
  permissionsContext: PermissionsContextType
) => {
  sinon.stub(React, 'useContext').returns(permissionsContext);
};

export const cleanUpPermissionsContext = () => {
  try {
    // $FlowIgnore designed to be used on stub created above
    React.useContext.restore();
  } catch {
    // Empty catch block as .restore() may not
    // be defined if there was an issue with the stub
    // so this catches that error. There is no need to do
    // anything with the error
  }
};

type MockedPermissionContextProviderType = {
  permissionsContext: PermissionsContextType,
  children: Node,
};

export const MockedPermissionContextProvider = ({
  permissionsContext,
  children,
}: MockedPermissionContextProviderType) => (
  // $FlowIgnore designed to be used on stub created above
  <PermissionsContext.Provider value={permissionsContext}>
    {children}
  </PermissionsContext.Provider>
);
