import { axios } from '@kitman/common/src/utils/services';

import { data as serverResponse } from '../mocks/handlers/getIntegrationData';
import getIntegrationData from '../getIntegrationData';

describe('getIntegrationData', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint, with the correct data', async () => {
    const response = await getIntegrationData({
      integrationId: 1,
      eventDate: '2025-10-15',
    });

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith(
      `/workloads/integrations/1/fetch_data`,
      { date: '2025-10-15' }
    );
  });
});
