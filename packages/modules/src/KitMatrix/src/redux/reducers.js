// @flow
import { searchKitMatricesApi } from './rtk/searchKitMatricesApi';
import { kitMatrixColorsApi } from './rtk/kitMatrixColorsApi';
import { clubsApi } from './rtk/clubsApi';
import kitManagementSlice, {
  REDUCER_KEY as kitManagementSliceKey,
} from './slice/kitManagementSlice';

export default {
  searchKitMatricesApi: searchKitMatricesApi.reducer,
  kitMatrixColorsApi: kitMatrixColorsApi.reducer,
  clubsApi: clubsApi.reducer,
  [kitManagementSliceKey]: kitManagementSlice.reducer,
};
