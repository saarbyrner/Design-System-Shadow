import { axios } from '@kitman/common/src/utils/services';

import updateAthleteIntegrationSettings from '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteIntegrationSettings';

describe('updateAthleteIntegrationSettings', () => {
  let updateAthleteIntegrationSettingsRequest;

  const requestBody = {
    inputs: [
      {
        key: 'oura__oura-participant-name',
        value: 'abc123',
      },
    ],
  };

  beforeEach(() => {
    updateAthleteIntegrationSettingsRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = {
      athleteId: 1,
      requestBody,
    };
    await updateAthleteIntegrationSettings(props);

    expect(updateAthleteIntegrationSettingsRequest).toHaveBeenCalledTimes(1);
    expect(updateAthleteIntegrationSettingsRequest).toHaveBeenCalledWith(
      `/athletes/${props.athleteId}/integration_settings`,
      props.requestBody
    );
  });
});
