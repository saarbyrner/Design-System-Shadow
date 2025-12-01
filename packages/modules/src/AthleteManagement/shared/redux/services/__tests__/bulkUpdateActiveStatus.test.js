import { axios } from '@kitman/common/src/utils/services';

import {
  bulkUpdateActiveStatus,
  BULK_UPDATE_ACTIVE_STATUS_ENDPOINT,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdateActiveStatus';

describe('bulkUpdateActiveStatus', () => {
  let bulkUpdateActiveStatusRequest;

  const requestBody = {
    athlete_ids: [1, 2, 3],
    is_active: true,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    bulkUpdateActiveStatusRequest = jest.spyOn(axios, 'patch');

    const returnedData = await bulkUpdateActiveStatus(requestBody);

    expect(returnedData).toEqual({});
    expect(bulkUpdateActiveStatusRequest).toHaveBeenCalledTimes(1);
    expect(bulkUpdateActiveStatusRequest).toHaveBeenCalledWith(
      BULK_UPDATE_ACTIVE_STATUS_ENDPOINT,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    bulkUpdateActiveStatusRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await bulkUpdateActiveStatus(requestBody);
    }).rejects.toThrow();
  });
});
