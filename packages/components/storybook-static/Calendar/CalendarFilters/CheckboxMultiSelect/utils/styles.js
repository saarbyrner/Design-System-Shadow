// @flow

import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export default {
  header: {
    container: css({ display: 'flex', flexDirection: 'row' }),
    divider: css({
      backgroundColor: colors.neutral_300,
      height: '0.75rem',
      margin: '0.5rem',
      width: '0.5px',
      display: 'block',
    }),
  },
  checkboxContainer: css({
    padding: '0 0.25rem',
    ul: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      li: {
        display: 'flex',
        alignItems: 'center',
        columnGap: '0.5rem',
        label: {
          marginBottom: 0,
        },
      },
    },
  }),
  footer: css({
    padding: '0.25rem 0',
  }),
};
