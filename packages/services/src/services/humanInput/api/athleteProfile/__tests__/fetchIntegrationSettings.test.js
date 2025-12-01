import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/services/humanInput/api/mocks/data/athleteProfile/fetchIntegrationSettings';
import fetchIntegrationSettings from '@kitman/services/src/services/humanInput/api/athleteProfile/fetchIntegrationSettings';

describe('fetchIntegrationSettings', () => {
  let fetchIntegrationSettingsRequest;

  beforeEach(() => {
    fetchIntegrationSettingsRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const athleteId = 1;
    const returnedData = await fetchIntegrationSettings(athleteId);

    expect(returnedData).toEqual(data);
    expect(fetchIntegrationSettingsRequest).toHaveBeenCalledTimes(1);
    expect(fetchIntegrationSettingsRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/integration_settings/edit`
    );
  });
});
