// @flow
import { axios } from '@kitman/common/src/utils/services';

export type TvChannel = {
  id: number,
  name: string,
};

export const GET_TV_CHANNELS_URL = '/planning_hub/tv_channels';

const getTVChannels = async (): Promise<Array<TvChannel>> => {
  const { data } = await axios.get(GET_TV_CHANNELS_URL);
  return data;
};

export default getTVChannels;
