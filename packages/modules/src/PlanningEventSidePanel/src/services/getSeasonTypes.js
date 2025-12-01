// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { SeasonType } from '../types';

const getSeasonTypes = async (): Promise<SeasonType[]> => {
  const { data } = await axios.get('/ui/season_types');
  return data;
};

export default getSeasonTypes;
