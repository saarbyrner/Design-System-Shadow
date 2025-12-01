// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import { data as medicalAlertData } from '@kitman/services/src/mocks/handlers/medical/getCurrentMedicalAlert';
import MedicalFlagContext from '..';
import * as MedicalFlagContextItems from '..';
import type { MedicalFlagContextType } from '..';

export const mockedMedicalFlagContextValue = {
  medicalFlag: medicalAlertData, // could use an alert as well?
  requestStatus: 'SUCCESS',
};

type MockedMedicalFlagContextProviderType = {
  medicalFlagContext: MedicalFlagContextType,
  children: Node,
};

export const MockedMedicalFlagContextProvider = ({
  medicalFlagContext,
  children,
}: MockedMedicalFlagContextProviderType) => (
  <MedicalFlagContext.Provider value={medicalFlagContext}>
    {children}
  </MedicalFlagContext.Provider>
);

export const mockedUseMedicalFlag = (
  medicalFlagContext: MedicalFlagContextType
) => {
  sinon
    .stub(MedicalFlagContextItems, 'useMedicalFlag')
    .returns(medicalFlagContext);
};

export const cleanUpMockIssue = () => {
  try {
    // $FlowIgnore designed to be used on stub created above
    MedicalFlagContextItems.useMedicalFlag.restore();
  } catch (e) {
    // Empty catch block as .restore() may not
    // be defined if there was an issue with the stub
    // so this catches that error. There is no need to do
    // anything with the error
  }
};
