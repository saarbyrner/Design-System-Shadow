// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicalAlertsFilter } from '@kitman/modules/src/Medical/shared/types';
import type { AthleteMedicalAlertDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medical_alerts: Array<AthleteMedicalAlertDataResponse>,
  next_id?: number,
};

const getAthleteMedicalAlerts = async (
  filters: MedicalAlertsFilter,
  nextMedicalAlertsPage: ?number
): Promise<RequestResponse> => {
  const { data } = await axios.post(
    '/ui/medical/athlete_medical_alerts/search',
    {
      filters: {
        ...filters,
      },
      next_id: nextMedicalAlertsPage,
      organisation_only: true,
    }
  );
  return data;
};

export default getAthleteMedicalAlerts;
