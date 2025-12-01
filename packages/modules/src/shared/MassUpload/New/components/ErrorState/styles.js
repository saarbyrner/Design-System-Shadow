// @flow
import { colors, breakPoints } from '@kitman/common/src/variables';

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
      width: '40%',
      margin: 'auto',

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
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',

      [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
        flexDirection: 'row',
      },

      '& button': {
        color: colors.grey_200,
        fontWeight: '600',
        lineHeight: 'initial',
        padding: '0px 0px 0px 4px',

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
    customErrorsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
  },
};
