import $ from 'jquery';
import { data as mockedScreenDrugToDrug } from '../../../mocks/handlers/medical/screenDrugToDrug';
import screenDrugToDrug from '../screenDrugToDrug';

describe('screenDrugToDrug', () => {
  let screenDrugToDrugRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    screenDrugToDrugRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedScreenDrugToDrug));
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

    const returnedData = await screenDrugToDrug(formState);

    expect(returnedData).toEqual(mockedScreenDrugToDrug);

    expect(screenDrugToDrugRequest).toHaveBeenCalledTimes(1);

    expect(screenDrugToDrugRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'POST',
      url: '/ui/medical/medications/drug_interaction_screen',
      data: JSON.stringify(formState),
    });
  });
});
