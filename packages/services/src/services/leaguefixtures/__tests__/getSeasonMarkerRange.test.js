import { axios } from '@kitman/common/src/utils/services';

import getSeasonMarkerRange from '../getSeasonMarkerRange';

const mockedSeasonMarkerRange = {
  season_marker_range: ['2014-06-14T00:00:00.000Z', '2023-12-31T00:00:00.000Z'],
};

describe('getSeasonMarkerRange service', () => {
  let getSeasonMarkerRangeRequest;

  beforeEach(() => {
    getSeasonMarkerRangeRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() =>
        Promise.resolve({ data: mockedSeasonMarkerRange })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getSeasonMarkerRange();

    expect(returnedData).toEqual(mockedSeasonMarkerRange.season_marker_range);

    expect(getSeasonMarkerRangeRequest).toHaveBeenCalledTimes(1);
    expect(getSeasonMarkerRangeRequest).toHaveBeenCalledWith(
      '/ui/initial_data_planning_hub'
    );
  });
});
