// @flow
import $ from 'jquery';
import type { AthleteMedicalAlertDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const archiveMedicalAlert = (
  medicalAlert: AthleteMedicalAlertDataResponse,
  reason: number
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/ui/medical/athlete_medical_alerts/${medicalAlert.id}/archive`,
      contentType: 'application/json',
      data: JSON.stringify({
        archived: true,
        archive_reason_id: reason,
      }),
    })
      .then((data) => data)
      .done(resolve)
      .fail(reject);
  });
};

export default archiveMedicalAlert;
