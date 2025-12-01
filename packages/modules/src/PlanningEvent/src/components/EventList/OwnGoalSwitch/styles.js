// @flow
import { breakPoints } from '@kitman/common/src/variables';

const styles = {
  formControlSx: {
    margin: 0,
    alignSelf: 'flex-end',

    [`@media (max-width: ${breakPoints.tablet})`]: {
      display: 'flex',
      alignSelf: 'flex-start',
    },
  },
};

export default styles;
