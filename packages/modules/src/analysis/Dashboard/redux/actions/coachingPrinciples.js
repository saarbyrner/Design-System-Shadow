// @flow
import { getAreCoachingPrinciplesEnabled } from '@kitman/services';
import setCoachingPrinciplesEnabled from '@kitman/common/src/actions/coachingPrinciplesActions';

import type { Action, ThunkAction } from '../types/actions';

const areCoachingPrinciplesEnabled =
  (): ThunkAction => (dispatch: (action: Action) => Action) => {
    getAreCoachingPrinciplesEnabled().then((response) => {
      dispatch(setCoachingPrinciplesEnabled(response?.value || false));
    });
  };

export default areCoachingPrinciplesEnabled;
