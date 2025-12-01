// @flow
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridKeys } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

import MLS_NEXT_PRO_GRIDS from '../mlsNextPro/index';

const MLS_GRIDS: {
  [key: UserType]: { [key: GridKeys]: Array<GridColDef> },
} = { ...MLS_NEXT_PRO_GRIDS };

export default MLS_GRIDS;
