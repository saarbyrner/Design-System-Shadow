import $ from 'jquery';
import archiveMedicalAlert from '../archiveMedicalAlert';
import { data as mockedAthleteMedicalAlertData } from '../../../mocks/handlers/medical/getAthleteMedicalAlertData';

describe('archiveMedicalAlert', () => {
  let archiveMedicalAlertRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    archiveMedicalAlertRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await archiveMedicalAlert(mockedAthleteMedicalAlertData[0], 2);

    expect(archiveMedicalAlertRequest).toHaveBeenCalledTimes(1);
    expect(archiveMedicalAlertRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PATCH',
        url: '/ui/medical/athlete_medical_alerts/13/archive',
        contentType: 'application/json',
      })
    );
  });
});
