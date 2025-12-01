// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  MedicalAlertData,
  MedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const updateMedicalAlert = async (
  alertId: number,
  medicalAlertData: MedicalAlertData
): Promise<MedicalAlertDataResponse> => {
  const { data } = await axios.put(
    `/medical/athlete_medical_alerts/${alertId}/update`,
    {
      attributes: {
        ...medicalAlertData,
      },
    }
  );

  return data;
};

export default updateMedicalAlert;
