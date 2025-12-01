// @flow
import type { SetCoachingPrinciplesEnabled } from '@kitman/common/src/types';

type Action = SetCoachingPrinciplesEnabled;

const setCoachingPrinciplesEnabled = (value: boolean): Action => ({
  type: 'SET_COACHING_PRINCIPLES_ENABLED',
  payload: {
    value,
  },
});

export default setCoachingPrinciplesEnabled;
