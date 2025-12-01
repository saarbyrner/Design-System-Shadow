// @flow
import { massUploadApi } from './massUploadApi';
import massUploadSlice from './massUploadSlice';

export default {
  massUploadApi: massUploadApi.reducer,
  massUploadSlice: massUploadSlice.reducer,
};
