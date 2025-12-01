// @flow
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';

export const store = {
  formStateSlice: {
    config: {
      mode: MODES.CREATE,
    },
  },
};

export const storeReadOnly = {
  formStateSlice: {
    config: {
      mode: MODES.CREATE,
    },
  },
};
