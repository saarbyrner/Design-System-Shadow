// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import getCurrentMedicalAllergy from '@kitman/services/src/services/medical/getCurrentAllergy';
import getCurrentMedicalAlert from '@kitman/services/src/services/medical/getCurrentMedicalAlert';
import type { RequestStatus } from '../../types';
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '../../types/medical';

type MedicalFlag = AthleteMedicalAlertDataResponse | AllergyDataResponse;

export type MedicalFlagContextType = {
  medicalFlag: MedicalFlag,
  requestStatus: ?string,
};
export const DEFAULT_CONTEXT_VALUE = {
  medicalFlag: {},
  requestStatus: 'PENDING',
};
const MedicalFlagContext = createContext<MedicalFlagContextType>(
  DEFAULT_CONTEXT_VALUE
);
type Props = {
  children: Node,
  medicalFlagType: string,
  medicalFlagId: number,
};
const MedicalFlagContextProvider = (props: Props) => {
  const [medicalFlag, setMedicalFlag] = useState<MedicalFlag>({});
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  useEffect(() => {
    if (props.medicalFlagType === 'allergies') {
      getCurrentMedicalAllergy(props.medicalFlagId).then(
        (medicalFlagData: MedicalFlag) => {
          setMedicalFlag(medicalFlagData);
          setRequestStatus('SUCCESS');
        },
        () => setRequestStatus('FAILURE')
      );
    } else {
      getCurrentMedicalAlert(props.medicalFlagId).then(
        (medicalFlagData: MedicalFlag) => {
          setMedicalFlag(medicalFlagData);
          setRequestStatus('SUCCESS');
        },
        () => setRequestStatus('FAILURE')
      );
    }
  }, []);

  const medicalFlagValue = {
    medicalFlag,
    requestStatus,
  };

  return (
    <MedicalFlagContext.Provider value={medicalFlagValue}>
      {props.children}
    </MedicalFlagContext.Provider>
  );
};

const useMedicalFlag = () => useContext(MedicalFlagContext);
export { MedicalFlagContextProvider, useMedicalFlag };
export default MedicalFlagContext;
