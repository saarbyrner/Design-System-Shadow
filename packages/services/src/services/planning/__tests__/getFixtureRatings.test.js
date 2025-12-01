import { axios } from '@kitman/common/src/utils/services';
import getFixtureRatings from '../getFixtureRatings';

describe('getFixtureRatings', () => {
  let request;
  const mockData = { id: 1, name: 'Text Fixture' };

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedDataFromGroup = await getFixtureRatings();

    expect(returnedDataFromGroup).toEqual(mockData);
    expect(request).toHaveBeenCalledWith('/ui/organisation_fixture_ratings');
  });
});
