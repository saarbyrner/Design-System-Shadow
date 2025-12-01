// @flow
import $ from 'jquery';
import type {
  ScreenDrugToDrugData,
  ScreenDrugToDrugDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const screenDrugToDrug = (
  screenDrugData: ScreenDrugToDrugData
): Promise<ScreenDrugToDrugDataResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/medical/medications/drug_interaction_screen',
      contentType: 'application/json',
      data: JSON.stringify({
        ...screenDrugData,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default screenDrugToDrug;
