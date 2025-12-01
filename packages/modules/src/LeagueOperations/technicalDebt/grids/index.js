/* eslint-disable no-unused-vars */
// @flow
import type { GridColDef } from '@mui/x-data-grid-pro';
import type {
  GridParams,
  GridKeys,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import MLS_NEXT_GRIDS from './mlsNext';
import MLS_NEXT_PRO_GRIDS from './mlsNextPro';
import MLS_GRIDS from './mls';

export type GetGridSetParams = {
  key: GridKeys,
  userType: UserType,
  orgKey: string,
};

const ORG_KEY_REGEX = /^[K|M](LS (NEXT|Next) Pro|LS (NEXT|Next)|LS)$/;

// A mapping of organization keys to their corresponding grid configurations.
// This object allows us to easily retrieve the grid configuration based on the organization key. ( for dev/staging and prod envs )
const ORG_KEYS = {
  MLS: MLS_GRIDS,
  KLS: MLS_GRIDS,
  'MLS NEXT PRO': MLS_NEXT_PRO_GRIDS,
  'KLS NEXT PRO': MLS_NEXT_PRO_GRIDS,
  'MLS NEXT': MLS_NEXT_GRIDS,
  'KLS NEXT': MLS_NEXT_GRIDS,
};

export const getGridSet = ({ key, userType, orgKey }: GetGridSetParams) => {
  if (!ORG_KEY_REGEX.test(orgKey)) {
    // Fallback to MLS_NEXT_GRIDS if the orgKey is not recognized, This is considered the default grid set.
    return MLS_NEXT_GRIDS[userType]?.[key];
  }

  const gridSet = ORG_KEYS[orgKey.toUpperCase()];

  return gridSet ? gridSet[userType]?.[key] || [] : [];
};

export const fetchGridSet = ({ key, userType, orgKey }: GridParams) => {
  return MLS_NEXT_GRIDS[userType][key];
};

export const parseLeagueOperationsGrids = ({
  key,
  userType,
  orgKey,
}: GridParams): Array<GridColDef> => {
  let columns = [];

  try {
    columns = getGridSet({
      key,
      userType,
      orgKey,
    });

    // TODO: remove this part of code totally because it will be handled in packages/modules/src/LeagueOperations/technicalDebt/grids/mlsNext/columnDefinitions.js
    if (window.getFlag('league-ops-discipline-area-v2')) {
      columns = columns.filter((col) => col.headerName !== 'Suspended until');
    } else {
      columns = columns.filter((col) => col.headerName !== 'Suspended');
    }
  } catch {
    console.warn(
      `Unsupported grid context for ${orgKey} when requesting ${key} for ${userType}`
    );
  }
  return columns;
};
