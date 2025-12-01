import { axios } from '@kitman/common/src/utils/services';
import getIsActivityTypeCategoriesEnabled from '../getIsActivityTypeCategoriesEnabled';

const mockData = [
  {
    value: true,
  },
];

describe('getIsActivityTypeCategoriesEnabled', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes the call to the correct endpoint', async () => {
    await getIsActivityTypeCategoriesEnabled();

    expect(request).toHaveBeenCalledWith(
      '/organisation_preferences/enable_activity_type_category'
    );
  });

  it('returns the correct data', async () => {
    const data = await getIsActivityTypeCategoriesEnabled();

    expect(data).toEqual(mockData);
  });
});
