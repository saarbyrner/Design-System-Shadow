// @flow
import React from 'react';
import type { Node } from 'react';
import sinon from 'sinon';
import PreferencesContext from '../preferenceContext';
import type { PreferenceContextType } from '../types';

// Mocking reacts useContext to return the context
export const mockPreferencesContext = (
  preferencesContext: PreferenceContextType
) => {
  sinon.stub(React, 'useContext').returns(preferencesContext);
};

export const cleanUpPreferencesContext = () => {
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

type MockedPreferenceContextProviderType = {
  preferencesContext: PreferenceContextType,
  children: Node,
};

export const MockedPreferenceContextProvider = ({
  preferencesContext,
  children,
}: MockedPreferenceContextProviderType) => (
  // $FlowIgnore designed to be used on stub created above
  <PreferencesContext.Provider value={preferencesContext}>
    {children}
  </PreferencesContext.Provider>
);
