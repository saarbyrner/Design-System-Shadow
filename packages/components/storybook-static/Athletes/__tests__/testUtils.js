// @flow
import React from 'react';
import sinon from 'sinon';
import type { AthleteContextType } from '../components/AthleteContext';
import { AthleteContext } from '../components/AthleteContext';

// Mocking reacts useContext to return the context
export const mockAthleteContext = (athleteContext: AthleteContextType) => {
  sinon.stub(React, 'useContext').returns(athleteContext);
};

export const updateMockContextValues = (athleteContext: AthleteContextType) => {
  // $FlowIgnore designed to be used on stub created above
  React.useContext.returns(athleteContext);
};

export const cleanUpAthleteContext = () => {
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

type MockedAthleteContextProviderType = {
  athleteContext: AthleteContextType,
  children: any,
};
export const MockedAthleteContextProvider = ({
  athleteContext,
  children,
}: MockedAthleteContextProviderType) => (
  <AthleteContext.Provider value={athleteContext}>
    {children}
  </AthleteContext.Provider>
);
