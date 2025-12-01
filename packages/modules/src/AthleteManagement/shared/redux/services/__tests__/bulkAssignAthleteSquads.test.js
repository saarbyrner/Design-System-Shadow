import { axios } from '@kitman/common/src/utils/services';

import {
  bulkAssignAthleteSquads,
  BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkAssignAthleteSquads';

describe('bulkAssignAthleteSquads', () => {
  let bulkAssignAthleteSquadsRequest;

  const requestBody = {
    athletes: [
      {
        id: 123,
        squad_ids: [4, 5, 7],
        primary_squad_id: 4,
      },
      {
        id: 234,
        squad_ids: [4, 5, 7],
        primary_squad_id: 4,
      },
      {
        id: 235,
        squad_ids: [4, 5],
        primary_squad_id: 4,
      },
      {
        id: 236,
        squad_ids: [4, 5],
        primary_squad_id: 5,
      },
    ],
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    bulkAssignAthleteSquadsRequest = jest.spyOn(axios, 'put');

    const returnedData = await bulkAssignAthleteSquads(requestBody);

    expect(returnedData).toEqual({});
    expect(bulkAssignAthleteSquadsRequest).toHaveBeenCalledTimes(1);
    expect(bulkAssignAthleteSquadsRequest).toHaveBeenCalledWith(
      BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    bulkAssignAthleteSquadsRequest = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await bulkAssignAthleteSquads(requestBody);
    }).rejects.toThrow();
  });
});
