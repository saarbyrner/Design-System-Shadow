// @flow
import $ from 'jquery';

export type Medication = {
  id: string,
  name: string,
};

export type MedicationRequest = {
  options: Array<Medication>,
  total: number,
  count: number,
  page: number,
  nextPage: ?number,
};
/**
 * /ui/medical/drfirst/search_allergy_groups fetches medications list from DrFirst
 * Pass through search string as param
 * Search query minimum 2 characters; validation on front-end
 */

const getAllergyMedications = (
  medication: string
): Promise<MedicationRequest> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/fdb/allergen_picklist',
      data: {
        search_expression: medication,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAllergyMedications;
