import { axios } from '@kitman/common/src/utils/services';
import { fetchSegment } from '@kitman/services/src/services/dynamicCohorts/index';
import { segmentResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';

describe('fetchSegment', () => {
  let fetchSegmentRequest;

  beforeEach(() => {
    fetchSegmentRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the segment requested', async () => {
    const response = await fetchSegment({ id: segmentResponse.id });

    expect(fetchSegmentRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(segmentResponse);
  });
});
