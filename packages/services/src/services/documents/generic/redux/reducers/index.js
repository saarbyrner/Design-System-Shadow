// @flow
import { genericDocumentsApi } from '@kitman/services/src/services/documents/generic';
import genericDocumentsSlice from '@kitman/services/src/services/documents/generic/redux/slices/genericDocumentsSlice';

export default {
  genericDocumentsApi: genericDocumentsApi.reducer,
  genericDocumentsSlice: genericDocumentsSlice.reducer,
};
