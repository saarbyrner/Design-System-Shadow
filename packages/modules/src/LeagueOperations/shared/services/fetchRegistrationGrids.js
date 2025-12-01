// @flow
// import { axios } from '@kitman/common/src/utils/services';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridParams } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { parseLeagueOperationsGrids } from '../../technicalDebt/grids';
import { MLS_NEXT } from '../consts';

const fetchRegistrationGrids = async ({
  key,
  userType,
  orgKey = MLS_NEXT,
}: GridParams): Promise<Array<GridColDef>> => {
  // We do not have a functional grid service.
  // For now, this is mocked in the FE and as abstracted as possible to minimise technical debt.
  return parseLeagueOperationsGrids({ key, userType, orgKey });
};

export default fetchRegistrationGrids;
