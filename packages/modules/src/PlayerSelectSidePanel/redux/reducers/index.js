// @flow
import phiModalSlice from '@kitman/modules/src/PHIModal/phiModalSlice';
import { playerSelectApi } from '../../services/api/playerSelectApi';
import playerSelectSlice from '../slices/playerSelectSlice';

export default {
  playerSelectApi: playerSelectApi.reducer,
  playerSelectSlice: playerSelectSlice.reducer,
  phiModalSlice: phiModalSlice.reducer,
};
