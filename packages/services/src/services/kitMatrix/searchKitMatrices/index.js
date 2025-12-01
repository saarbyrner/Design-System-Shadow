// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  PlayerType,
  EquipmentName,
} from '@kitman/modules/src/KitMatrix/shared/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import { omit } from 'lodash';
import type { LeagueSeason } from '../getLeagueSeasons';

type Search = $Shape<{
  archived?: boolean,
  kinds: Array<PlayerType>,
  search_expression: string,
  organisation_ids: Array<number>,
  squad_ids: Array<number>,
  division_ids: Array<number>,
  kit_matrix_color_ids: Array<number>,
  include_games_count: boolean,
}>;

type KitMatrixItem = {
  id: number,
  kind: EquipmentName,
  kit_matrix_color_id: number,
  attachment: {
    id: number,
    url: string,
    filename: string,
    filetype: string,
  },
  kit_matrix_color: {
    id: number,
    name: string,
  },
};

export type KitMatrix = {
  id: number,
  kind: PlayerType,
  organisation: {
    id: number,
    name: string,
    logo_full_path: ?string,
  },
  squads: Array<Squad>,
  name: string,
  primary_color: string,
  secondary_color?: string,
  archived_at?: Date,
  kit_matrix_items: Array<KitMatrixItem>,
  league_season?: LeagueSeason,
  league_season_id?: number,
  games_count: number,
  division: {
    id: number,
    name: string,
  },
};

export type SearchResponse = {
  kit_matrices: Array<KitMatrix>,
  next_id?: number,
};

const searchKitMatrices = async (filters: Search): Promise<SearchResponse> => {
  const { data } = await axios.post(
    '/planning_hub/kit_matrices/search',
    omit(filters, ['include_games_count']),
    {
      params: {
        include_games_count: filters.include_games_count,
      },
    }
  );
  return data;
};

export default searchKitMatrices;
