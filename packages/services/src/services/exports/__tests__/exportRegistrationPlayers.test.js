import { axios } from '@kitman/common/src/utils/services';
import { data as exportRegistrationPLayersResponse } from '@kitman/services/src/mocks/handlers/exports/exportRegistrationPlayers';
import exportRegistrationPlayers from '../exportRegistrationPlayers';

describe('exportRegistrationPlayers', () => {
  let exportHomegrownPlayersRequest;

  beforeEach(() => {
    exportHomegrownPlayersRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: exportRegistrationPLayersResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return the correct response value', async () => {
    const result = await exportRegistrationPlayers();

    expect(result).toEqual(exportRegistrationPLayersResponse);
    expect(exportHomegrownPlayersRequest).toHaveBeenCalledTimes(1);
    expect(exportHomegrownPlayersRequest).toHaveBeenCalledWith(
      '/export_jobs/registration_players_export'
    );
  });
});
