// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AthleteMedicalAlertDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

// retrieves single medical alert for current athlete

const getCurrentMedicalAlert = async (
  medicalAlertID: number
): Promise<AthleteMedicalAlertDataResponse> => {
  const { data } = await axios.get(
    `/ui/medical/athlete_medical_alerts/${medicalAlertID}`
  );
  return data;
};

export default getCurrentMedicalAlert;
