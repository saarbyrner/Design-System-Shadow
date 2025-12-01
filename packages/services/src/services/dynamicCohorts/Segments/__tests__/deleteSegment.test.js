import { axios } from '@kitman/common/src/utils/services';
import { deleteSegment } from '@kitman/services/src/services/dynamicCohorts/index';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';

describe('deleteSegment', () => {
  let deleteRequest;

  beforeEach(() => {
    deleteRequest = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns nothing', async () => {
    const requestParams = 10;
    const response = await deleteSegment(requestParams);

    expect(deleteRequest).toHaveBeenCalledTimes(1);
    expect(deleteRequest).toHaveBeenCalledWith(
      `${baseSegmentsURL}/${requestParams}`
    );
    expect(response).toEqual();
  });
});
