// @flow
import $ from 'jquery';
import type {
  StockMedicationData,
  StockMedicationRequestResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const dispenseMedication = (
  stockMedications: StockMedicationData
): Promise<StockMedicationRequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/medical/medications',
      contentType: 'application/json',
      data: JSON.stringify({
        ...stockMedications,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default dispenseMedication;
