import { axios } from '@kitman/common/src/utils/services';

import { data as serverResponse } from '../mocks/handlers/getThirdPartyImports';
import getThirdPartyImports from '../getThirdPartyImports';

describe('getThirdPartyImports', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint, with the correct data', async () => {
    const payload = { eventId: '123', integrationName: 'catapult' };
    const response = await getThirdPartyImports(payload);

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith(
      `planning_hub/events/${payload.eventId}/third_party_imports/${payload.integrationName}`
    );
  });
});
