import { axios } from '@kitman/common/src/utils/services';
import getKitMatrixColors from '..';
import mockData from '../mock';

describe('getKitMatrixColors', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const data = await getKitMatrixColors();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/planning_hub/kit_matrix_colors');
    expect(data).toEqual(mockData);
  });
});
