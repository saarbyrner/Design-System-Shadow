// @flow
import { additionalUsersAPI } from '../services';
import additionalUsersSlice from '../slices/additionalUsersSlice';

export default {
  additionalUsersSlice: additionalUsersSlice.reducer,
  additionalUsersAPI: additionalUsersAPI.reducer,
};
