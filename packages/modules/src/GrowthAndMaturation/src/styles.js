// @flow
import { colors } from '@kitman/common/src/variables';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

export default {
  wrapper: {
    backgroundColor: 'background.default',
    height: '3.75rem',
    padding: '1rem 1.5rem',
  },
  title: {
    color: 'text.secondary',
    fontWeight: 600,
  },
  tableCells: {
    paddingRight: convertPixelsToREM(60),
  },
  link: {
    fontSize: '14px',
    color: colors.grey_300,
    fontWeight: 600,
    padding: '0px',

    '&:visited': {
      color: colors.grey_300,
    },

    '&:hover': {
      textDecoration: 'underline',
    },
  },
};
