// @flow
import $ from 'jquery';
import type {
  MedicalAlertData,
  MedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const saveMedicalAlert = (
  medicalAlertData: MedicalAlertData
): Promise<MedicalAlertDataResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/medical/athlete_medical_alerts',
      contentType: 'application/json',
      data: JSON.stringify({
        ...medicalAlertData,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveMedicalAlert;
