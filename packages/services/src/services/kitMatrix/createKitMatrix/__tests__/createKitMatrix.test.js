import { axios } from '@kitman/common/src/utils/services';
import createKitMatrix from '..';
import mockData from '../mock';

describe('createKitMatrix', () => {
  let createKitMatrixRequest;
  beforeEach(() => {
    createKitMatrixRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({ data: mockData }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('calls the correct endpoint', async () => {
    const res = await createKitMatrix(mockData);

    expect(createKitMatrixRequest).toHaveBeenCalledTimes(1);
    expect(createKitMatrixRequest).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices',
      mockData,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    expect(res).toEqual(mockData);
  });
});
