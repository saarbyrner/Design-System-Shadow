// @flow

import { breakPoints } from '@kitman/common/src/variables';

const styles = {
  container: {
    [`@media (max-width: ${breakPoints.tablet})`]: {
      position: 'absolute',
      right: '16px',
      top: '16px',
    },
  },
  mobileActions: {
    display: 'none',
    [`@media (max-width: ${breakPoints.tablet})`]: {
      display: 'flex',
      gap: '8px',
    },
  },
  desktopActions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px',
    [`@media (max-width: ${breakPoints.tablet})`]: {
      display: 'none',
    },
  },
};

export { styles };
