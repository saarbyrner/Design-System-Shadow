import { axios } from '@kitman/common/src/utils/services';
import { data as mockAllergyData } from '../../../mocks/handlers/medical/updateAllergy';
import updateAllergy from '../updateAllergy';

describe('updateAllergy', () => {
  let updateMedicalRequest;
  beforeEach(() => {
    updateMedicalRequest = jest.spyOn(axios, 'put').mockImplementation(() => {
      return new Promise((resolve) => resolve({ data: mockAllergyData }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const allergyId = 3;

    const updatedAllergy = {
      display_name: 'New Custom Allergy Name',
      name: 'Custom Allergy Name',
      ever_been_hospitalised: false,
      require_epinephrine: true,
      symptoms: 'Sore right foot.',
      severity: 'severe',
      restricted_to_doc: false,
      restricted_to_psych: false,
      diagnosed_on: null,
    };

    const returnedData = await updateAllergy(allergyId, updatedAllergy);

    expect(returnedData).toEqual(mockAllergyData);
    expect(updateMedicalRequest).toHaveBeenCalledTimes(1);
    expect(updateMedicalRequest).toHaveBeenCalledWith(
      `/medical/allergies/${allergyId}/update`,
      {
        attributes: updatedAllergy,
      }
    );
  });
});
