// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  error: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem 0',
      height: '20.375rem',
      'i:before': {
        fontSize: '4rem',
        color: colors.red_100,
      },
    },
    title: {
      color: colors.grey_200,
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.375rem',
    },
    expectedHeaders: {
      color: colors.grey_200,
      fontSize: '.875rem',
      fontWeight: 500,
      lineHeight: '1.25rem',

      '& button': {
        color: colors.grey_200,
        fontWeight: '600',

        '&:hover': {
          textDecoration: 'underline',
          color: colors.grey_200,
        },
      },
    },
    providedHeaders: {
      color: colors.red_100,
      fontSize: '.875rem',
      fontWeight: 500,
      lineHeight: '1.25rem',
    },
  },
};
