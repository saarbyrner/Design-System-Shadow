// @flow
import messagingSlice from '@kitman/modules/src/Messaging/src/redux/slices/messagingSlice';
import { messagingApi } from '@kitman/modules/src/Messaging/src/redux/services/messaging';

export default {
  messagingSlice: messagingSlice.reducer,
  messagingApi: messagingApi.reducer,
};
