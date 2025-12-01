// @flow
import $ from 'jquery';
import type {
  AllergyData,
  AllergyDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const saveAllergyMedication = (
  allergyData: AllergyData
): Promise<AllergyDataResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/medical/allergies',
      contentType: 'application/json',
      data: JSON.stringify({
        ...allergyData,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveAllergyMedication;
