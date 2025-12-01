import $ from 'jquery';
import { data as mockedAllergyMedicationData } from '../../../mocks/handlers/medical/getAllergyMedicationsData';
import saveAllergyMedication from '../saveAllergyMedication';

describe('saveAllergyMedications', () => {
  let saveAllergyMedicationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    saveAllergyMedicationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAllergyMedicationData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formState = {
      athlete_id: 28101,
      allergen: {
        type: 'DrfirstDrug',
        search_expression: 'alco',
        rcopia_id: '8006',
      },
      name: 'Optional Additional Name',
      ever_been_hospitalised: true,
      require_epinephrine: false,
      symptoms: 'Sample symptoms that may exist.',
      severity: 'severe',
      restricted_to_doc: false,
      restricted_to_psych: false,
      diagnosed_on: '2022-10-17',
    };

    const returnedData = await saveAllergyMedication(formState);

    expect(returnedData).toEqual(mockedAllergyMedicationData);

    expect(saveAllergyMedicationRequest).toHaveBeenCalledTimes(1);

    expect(saveAllergyMedicationRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'POST',
      url: '/ui/medical/allergies',
      data: JSON.stringify(formState),
    });
  });
});
