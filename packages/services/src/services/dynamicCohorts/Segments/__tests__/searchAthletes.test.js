import { axios } from '@kitman/common/src/utils/services';
import { searchAthletes } from '@kitman/services/src/services/dynamicCohorts/index';
import { segmentResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import { paginatedAthletesResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchAthletes';

describe('searchAthletes', () => {
  let searchAthletesRequest;

  beforeEach(() => {
    searchAthletesRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the list of athletes', async () => {
    const response = await searchAthletes({
      expression: segmentResponse.expression,
    });

    expect(searchAthletesRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(paginatedAthletesResponse);
  });
});
