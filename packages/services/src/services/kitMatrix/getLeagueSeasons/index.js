// @flow
import { axios } from '@kitman/common/src/utils/services';

export type LeagueSeason = {
  id: number,
  name: string,
  start_date: string,
  end_date: string,
  division_id: number,
};

const getLeagueSeasons = async (): Promise<Array<LeagueSeason>> => {
  const { data } = await axios.get('/league_seasons');
  return data;
};

export default getLeagueSeasons;
