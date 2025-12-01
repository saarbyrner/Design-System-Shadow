// @flow
import $ from 'jquery';
import type {
  ScreenAllergyToDrugData,
  ScreenAllergyToDrugDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const screenAllergyToDrug = (
  screenAllergyData: ScreenAllergyToDrugData
): Promise<ScreenAllergyToDrugDataResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/medical/medications/allergy_screen',
      contentType: 'application/json',
      data: JSON.stringify({
        ...screenAllergyData,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default screenAllergyToDrug;
