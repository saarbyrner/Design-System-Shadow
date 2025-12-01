// @flow
import phiModalSlice from '@kitman/modules/src/PHIModal/phiModalSlice';
import { eventSwitchApi } from '../../services/api/eventSwitchApi';
import eventSwitchSlice from '../slices/eventSwitchSlice';

export default {
  eventSwitchApi: eventSwitchApi.reducer,
  eventSwitcherSlice: eventSwitchSlice.reducer,
  phiModalSlice: phiModalSlice.reducer,
};
