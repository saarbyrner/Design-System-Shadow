/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

import { type NextGameDisciplineIssueParams } from '../types/discipline';

type Organisations = {
  id: number,
  name: string,
  owner_id: string,
  owner_name: string,
  logo_full_path: string,
};

export type NextGameDisciplineIssue = {
  id: number,
  name: string,
  start_date: string,
  end_date: string,
  local_timezone: string,
  squad: Organisations,
  opponent_squad: Organisations,
  owner_id: string,
};

export type NextGameDisciplineIssueResponse = Array<NextGameDisciplineIssue>;

const fetchNextGameDisciplineIssue = async ({
  number_of_games,
  squad_id,
  start_date,
  competition_ids = [],
}: NextGameDisciplineIssueParams): Promise<NextGameDisciplineIssueResponse> => {
  const { data } = await axios.post(`/discipline/next_games`, {
    number_of_games,
    squad_id,
    start_date,
    competition_ids,
  });
  return data;
};

export default fetchNextGameDisciplineIssue;
