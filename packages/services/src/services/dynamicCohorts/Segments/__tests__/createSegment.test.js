import { axios } from '@kitman/common/src/utils/services';
import { createSegment } from '@kitman/services/src/services/dynamicCohorts/index';
import {
  segmentRequest,
  segmentResponse,
} from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';

describe('createSegment', () => {
  let createSegmentRequest;

  beforeEach(() => {
    createSegmentRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the created segment', async () => {
    const response = await createSegment(segmentRequest);

    expect(createSegmentRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(segmentResponse);
  });
});
