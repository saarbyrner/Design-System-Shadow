import { axios } from '@kitman/common/src/utils/services';

import {
  bulkUpdatePrimarySquad,
  BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkUpdatePrimarySquad';

describe('bulkAssignAthleteSquads', () => {
  let bulkUpdatePrimarySquadRequest;

  const requestBody = {
    athlete_ids: [1, 2, 3],
    primary_squad_id: 456,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    bulkUpdatePrimarySquadRequest = jest.spyOn(axios, 'put');

    const returnedData = await bulkUpdatePrimarySquad(requestBody);

    expect(returnedData).toEqual({});
    expect(bulkUpdatePrimarySquadRequest).toHaveBeenCalledTimes(1);
    expect(bulkUpdatePrimarySquadRequest).toHaveBeenCalledWith(
      BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    bulkUpdatePrimarySquadRequest = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await bulkUpdatePrimarySquad(requestBody);
    }).rejects.toThrow();
  });
});
