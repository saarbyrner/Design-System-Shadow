import { axios } from '@kitman/common/src/utils/services';

import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getUnassignedAthletes';
import getUnassignedAthletes from '../getUnassignedAthletes';

describe('getUnassignedAthletes', () => {
  let getUnassignedAthletesRequest;

  beforeEach(() => {
    getUnassignedAthletesRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const searchExpression = 'Free';
    const returnedData = await getUnassignedAthletes({
      searchQuery: searchExpression,
    });

    expect(returnedData).toEqual(data);
    expect(getUnassignedAthletesRequest).toHaveBeenCalledTimes(1);
    expect(getUnassignedAthletesRequest).toHaveBeenCalledWith(
      '/ui/unassigned_athletes',
      {
        params: {
          search_expression: searchExpression,
          per_page: 25,
          page: 1,
        },
      }
    );
  });
});
