import { axios } from '@kitman/common/src/utils/services';
import getTvChannels, { GET_TV_CHANNELS_URL } from '..';
import mock from '../mock';

describe('getTvChannels', () => {
  it('calls the correct endpoint', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const data = await getTvChannels();
    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith(GET_TV_CHANNELS_URL);
    expect(data).toEqual(mock);
  });
});
