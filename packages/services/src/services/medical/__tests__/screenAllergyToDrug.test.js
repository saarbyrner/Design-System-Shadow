import $ from 'jquery';
import { data as mockedScreenAllergyToDrug } from '../../../mocks/handlers/medical/screenAllergyToDrug';
import screenAllergyToDrug from '../screenAllergyToDrug';

describe('screenAllergyToDrug', () => {
  let screenAllergyToDrugRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    screenAllergyToDrugRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedScreenAllergyToDrug));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formState = {
      athlete_id: 27280,
      drug_type: 'FdbDispensableDrug',
      drug_id: 4,
    };

    const returnedData = await screenAllergyToDrug(formState);

    expect(returnedData).toEqual(mockedScreenAllergyToDrug);

    expect(screenAllergyToDrugRequest).toHaveBeenCalledTimes(1);

    expect(screenAllergyToDrugRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'POST',
      url: '/ui/medical/medications/allergy_screen',
      data: JSON.stringify(formState),
    });
  });
});
