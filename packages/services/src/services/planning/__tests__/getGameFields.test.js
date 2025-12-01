import { axios } from '@kitman/common/src/utils/services';
import getGameFields from '../getGameFields';

describe('getGameFields', () => {
  let request;
  const mockData = [
    {
      id: 1,
      name: '11v11',
      columns: 11,
      rows: 11,
    },
  ];

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const result = await getGameFields();

    expect(result).toEqual(mockData);
    expect(request).toHaveBeenCalledWith('/ui/planning_hub/fields');
  });
});
