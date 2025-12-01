// @flow

import { colors } from '@kitman/common/src/variables';

export default {
  containerRight: {
    position: 'absolute',
    bottom: 0,
    right: '65px',
    width: '340px',
    minHeight: '40px',
    marginRight: '20px',
    backgroundColor: colors.grey_200,
    color: colors.white,
    borderRadius: '3px 3px 0px 0px',
    zIndex: 4,
    filter:
      'drop-shadow(0px 0.6px 1.8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 3.2px 7.2px rgba(0, 0, 0, 0.13))',
  },
  containerLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '340px',
    minHeight: '40px',
    marginLeft: '20px',
    backgroundColor: colors.grey_200,
    color: colors.white,
    filter:
      'drop-shadow(0px 0.6px 1.8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 3.2px 7.2px rgba(0, 0, 0, 0.13))',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '40px',
    margin: '0px 12px 0px 20px',
    ':hover': {
      cursor: 'pointer',
    },
    p: {
      margin: 0,
    },
  },
  button: {
    backgroundColor: 'transparent',
    border: 0,
    paddingRight: '0px',
  },
  icon: {
    color: colors.white,
    fontWeight: 'bold',
    ':first-of-type': {
      padding: '0px 6px',
    },
  },
  content: {
    backgroundColor: colors.white,
    color: colors.grey_200,
    maxHeight: '400px',
    overflow: 'scroll',
    p: {
      margin: 0,
      padding: '8px 16px',
    },
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
};
