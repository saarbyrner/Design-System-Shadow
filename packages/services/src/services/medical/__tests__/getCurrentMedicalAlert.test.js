import { axios } from '@kitman/common/src/utils/services';
import { data as medicalAlertResponse } from '../../../mocks/handlers/medical/getCurrentMedicalAlert';
import getCurrentMedicalAlert from '../getCurrentMedicalAlert';

describe('getCurrentMedicalAlert', () => {
  const getCurrentMedicalAlertRequest = jest.spyOn(axios, 'get');

  it('calls the correct endpoint', async () => {
    const response = await getCurrentMedicalAlert(1);

    expect(getCurrentMedicalAlertRequest).toHaveBeenCalledTimes(1);
    expect(getCurrentMedicalAlertRequest).toHaveBeenCalledWith(
      '/ui/medical/athlete_medical_alerts/1'
    );
    expect(response).toEqual(medicalAlertResponse);
  });
});
