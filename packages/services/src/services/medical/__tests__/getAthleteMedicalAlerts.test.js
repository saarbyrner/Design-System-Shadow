import { axios } from '@kitman/common/src/utils/services';
import { data as mockedAthleteMedicalAlertData } from '../../../mocks/handlers/medical/getAthleteMedicalAlertData';
import getAthleteMedicalAlerts from '../getAthleteMedicalAlerts';

describe('getAthleteMedicalAlerts', () => {
  let getAthleteMedicalAlertDataRequest;

  beforeEach(() => {
    getAthleteMedicalAlertDataRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formState = {
      athlete_id: 40211,
      archived: false,
    };

    const returnedData = await getAthleteMedicalAlerts(formState, 1);

    expect(returnedData).toEqual(mockedAthleteMedicalAlertData);

    expect(getAthleteMedicalAlertDataRequest).toHaveBeenCalledTimes(1);

    expect(getAthleteMedicalAlertDataRequest).toHaveBeenCalledWith(
      '/ui/medical/athlete_medical_alerts/search',
      {
        next_id: 1,
        organisation_only: true,
        filters: {
          ...formState,
        },
      }
    );
  });
});
