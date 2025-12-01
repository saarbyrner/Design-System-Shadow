// @flow
import $ from 'jquery';
import { axios } from '@kitman/common/src/utils/services';

export type Team = {
  id: number,
  name: string,
};
export type Teams = Array<Team>;

const getTeams = (): Promise<Teams> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/teams',
    })
      .done(resolve)
      .fail(reject);
  });
};

export const getTeamsByCompetitionId = async (id: number): Promise<Teams> => {
  const { data } = await axios.get(`/teams?competition_id=${id}`);
  return data;
};

export type Squad = {
  id: number,
  name: string,
  created: string,
  updated: string | null,
  created_by: string | null,
  duration: number | null,
  sport_id: number | null,
  is_default: boolean | null,
};

export const getCurrentSquad = async (): Promise<Squad> => {
  const { data } = await axios.get('/ui/initial_data_assessments');
  return data.current_squad;
};

export default getTeams;
