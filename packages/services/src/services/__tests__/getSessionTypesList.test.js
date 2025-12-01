import { axios } from '@kitman/common/src/utils/services';
import getSessionTypesList from '../getSessionTypesList';
import { data as mockData } from '../../mocks/handlers/getSessionTypesList';

describe('getSessionTypesList', () => {
  it('should call the correct endpoint and return the data', async () => {
    const getSpy = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: mockData });

    const result = await getSessionTypesList();

    expect(getSpy).toHaveBeenCalledWith(
      '/session_types/session_type_names_list'
    );
    expect(result).toEqual(mockData);

    getSpy.mockRestore();
  });
});
