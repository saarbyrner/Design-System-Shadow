// @flow
import type { Node } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { SetState } from '@kitman/common/src/types/react';
import type { DataGridProps } from '@kitman/playbook/components/wrappers/DataGrid/types';
import type { SearchResponse } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import type { RequestResponse } from '@kitman/services/src/services/getClubs';
import type { KitMatrixColor } from '@kitman/services/src/services/kitMatrix/getKitMatrixColors';
import type { LeagueSeason } from '@kitman/services/src/services/kitMatrix/getLeagueSeasons';

export type FileInfo = {
  url: string,
  name: string,
  type: string,
};

export type FiltersType = {
  search: string,
  clubs: Array<number>,
  colors: Array<number>,
  types: Array<string>,
};

export type FilterName = 'search' | 'clubs' | 'colors' | 'types';

export type EquipmentName = 'jersey' | 'socks' | 'shorts';
export type FieldName =
  | EquipmentName
  | 'type'
  | 'organisation'
  | 'name'
  | 'color'
  | 'division'
  | 'league_season';

export type PlayerType = 'player' | 'goalkeeper' | 'referee';

export type EquipmentError = {
  colorId?: string,
  image?: string,
};

export type FormError = {
  type: string,
  organisation: string,
  name: string,
  color: string,
  jersey: EquipmentError | null,
  shorts: EquipmentError | null,
  socks: EquipmentError | null,
  division: string,
  league_season?: string | null,
};

type Equipment = {
  colorId: number,
  colorName: string,
  image: FileInfo,
};

export type Kit = {
  type: PlayerType,
  organisation: ?{
    id: number,
    name: string,
    logo_full_path: ?string,
  },
  name: string,
  color: string,
  jersey: Equipment,
  shorts: Equipment,
  socks: Equipment,
  id: ?number,
  status: ?string,
  games_count: number,
  division: ?{
    id: number,
    name: string,
  },
  league_season?: ?LeagueSeason,
};

export type UpdateKit = Kit & {
  id: number,
  status: string,
};

export type QueryData<T> = {
  data: ?T,
  isFetching: boolean,
  refetch: Function,
  error: Object,
};

export type UseKitMatrixDataGridReturns = {
  setNextId: SetState<number | null>,
  search: string,
  onSearchChange: (value: string) => void,
  searchKitMatricesQuery: QueryData<SearchResponse>,
  getClubsQuery: QueryData<RequestResponse>,
  getKitMatrixColorsQuery: QueryData<Array<KitMatrixColor>>,
  renderFilter: (name: FilterName) => Node | null,
  renderDataGrid: () => Node,
};

export type UseKitMatrixDataGrid = {
  dataGridProps?: DataGridProps,
  customColumns?: ({ refetch: Function }) => GridColDef[],
};

export type GameKitMatrixEquipment = {
  id: number,
  kind: EquipmentName,
  kit_matrix_color_id: number,
  kit_matrix_color: {
    id: number,
    name: string,
  },
  attachment: {
    id: number,
    url: string,
    filename: string,
    filetype: string,
  },
};
