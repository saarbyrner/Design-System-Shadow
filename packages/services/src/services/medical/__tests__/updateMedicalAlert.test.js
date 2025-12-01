import { axios } from '@kitman/common/src/utils/services';
import { data as mockMedicalAlertData } from '../../../mocks/handlers/medical/updateMedicalAlert';
import updateMedicalAlert from '../updateMedicalAlert';

describe('updateMedicalAlert', () => {
  let updateMedicalRequest;
  beforeEach(() => {
    updateMedicalRequest = jest.spyOn(axios, 'put').mockImplementation(() => {
      return new Promise((resolve) => resolve({ data: mockMedicalAlertData }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const alertId = 2;

    const updatedMedicalAlert = {
      alert_title: 'Ear Ache',
      athlete_id: 44,
      diagnosed_on: '2023-06-02T12:00:00Z',
      id: 13,
      medical_alert: {
        id: 7,
        name: 'Really Stuffy Nose',
      },
      restricted_to_doc: false,
      restricted_to_psych: false,
      severity: 'severe',
    };

    const returnedData = await updateMedicalAlert(alertId, updatedMedicalAlert);

    expect(returnedData).toEqual(mockMedicalAlertData);
    expect(updateMedicalRequest).toHaveBeenCalledTimes(1);
    expect(updateMedicalRequest).toHaveBeenCalledWith(
      `/medical/athlete_medical_alerts/${alertId}/update`,
      {
        attributes: updatedMedicalAlert,
      }
    );
  });
});
