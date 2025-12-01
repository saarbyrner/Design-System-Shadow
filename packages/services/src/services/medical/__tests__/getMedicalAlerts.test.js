import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getMedicalAlerts';
import getMedicalAlerts from '../getMedicalAlerts';

describe('getMedicalAlerts', () => {
  let getMedicalAlertsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getMedicalAlertsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getMedicalAlerts();

    expect(returnedData).toEqual(data);

    expect(getMedicalAlertsRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalAlertsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/medical_alerts',
    });
  });
});
