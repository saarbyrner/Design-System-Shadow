// @flow
import $ from 'jquery';
import type {
  StockMedicationData,
  StockMedicationRequestResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const updateMedication = (
  id: number,
  stockMedications: StockMedicationData
): Promise<StockMedicationRequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/ui/medical/medications/${id}`,
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

export default updateMedication;
