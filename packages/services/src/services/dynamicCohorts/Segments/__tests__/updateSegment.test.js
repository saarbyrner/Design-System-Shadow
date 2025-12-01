import { axios } from '@kitman/common/src/utils/services';
import { updateSegment } from '@kitman/services/src/services/dynamicCohorts';
import { segmentResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';

describe('updateSegment', () => {
  let updateSegmentRequest;

  beforeEach(() => {
    updateSegmentRequest = jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the updated label', async () => {
    const response = await updateSegment(segmentResponse);

    expect(updateSegmentRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(segmentResponse);
  });
});
