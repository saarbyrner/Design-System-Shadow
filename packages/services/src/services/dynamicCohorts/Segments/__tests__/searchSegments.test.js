import { axios } from '@kitman/common/src/utils/services';
import { searchSegments } from '@kitman/services/src/services/dynamicCohorts/index';
import { paginatedSegmentsResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchSegments';

describe('searchSegments', () => {
  let searchSegmentsRequest;

  beforeEach(() => {
    searchSegmentsRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the list of segments', async () => {
    const response = await searchSegments({
      nextId: 12,
    });

    expect(searchSegmentsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(paginatedSegmentsResponse);
  });
});
