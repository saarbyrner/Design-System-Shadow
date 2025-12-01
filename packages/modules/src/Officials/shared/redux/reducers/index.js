// @flow
import officialSlice from '../slices/officialSlice';
import { officialAPI } from '../services/index';

export default {
  officialSlice: officialSlice.reducer,
  officialAPI: officialAPI.reducer,
};
