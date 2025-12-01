// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AxiosPromise } from 'axios';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { Formation } from '@kitman/common/src/types/PitchView';
import type { Game } from '../../types';

// CREATE - POST - /ui/planning_hub/lineups
// UPDATE - PATCH - /ui/planning_hub/lineups/4
// ALL - GET - /ui/planning_hub/lineups
// FIND - GET - /ui/planning_hub/lineups/4
// DELETE- DELETE- /ui/planning_hub/lineups/4

type LineUpPosition = {
  athlete_id: string | number,
  formation_position_view_id: ?number,
}[];

type LineUpData = {
  name: string,
  organisation_format_id: number,
  formation_id: number,
  lineup_positions: LineUpPosition,
};

export type LineUpTemplateAuthor = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
};

export type LineUpTemplate = {
  id: number,
  name: string,
  organisation_format_id: number,
  formation_id: number,
  lineup_positions: {
    athlete_id: string | number,
    formation_position_view: {
      id: number,
      field_id: number,
      formation_id: number,
      position: {
        id: number,
        name: string,
        order: number,
        abbreviation?: string,
      },
      x: number,
      y: number,
      order: number,
    },
  }[],
  author: LineUpTemplateAuthor,
};

export type EnrichedLineUpTemplate = LineUpTemplate & {
  gameFormat: OrganisationFormat,
  formation: Formation,
};

const create = (data: LineUpData): AxiosPromise<LineUpTemplate> => {
  return axios.post<LineUpTemplate>('/ui/planning_hub/lineups', data);
};

const get = (id: number): AxiosPromise<LineUpTemplate> => {
  return axios.get<LineUpTemplate>(`/ui/planning_hub/lineups/${id}`);
};

const getAll = (): AxiosPromise<LineUpTemplate[]> => {
  return axios.get('/ui/planning_hub/lineups');
};

const getLastGame = (eventId: number): AxiosPromise<Game> => {
  return axios.get(`/planning_hub/events/${eventId}/last_game`);
};

export default {
  create,
  get,
  getAll,
  getLastGame,
};
