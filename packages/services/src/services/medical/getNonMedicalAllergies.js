// @flow
import $ from 'jquery';

export type NonMedicalAllergyType = {
  id: number,
  name: string,
  allergen_type: string,
};
export type NonMedicalAllergyTypes = Array<NonMedicalAllergyType>;

const getNonMedicalAllergies = (): Promise<NonMedicalAllergyTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/misc_allergies',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getNonMedicalAllergies;
