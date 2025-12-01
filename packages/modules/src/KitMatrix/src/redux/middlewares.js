// @flow
import { searchKitMatricesApi } from './rtk/searchKitMatricesApi';
import { kitMatrixColorsApi } from './rtk/kitMatrixColorsApi';
import { clubsApi } from './rtk/clubsApi';

export default [
  searchKitMatricesApi.middleware,
  kitMatrixColorsApi.middleware,
  clubsApi.middleware,
];
