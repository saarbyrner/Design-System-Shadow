// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  text: css({
    marginBottom: '3.3rem',
  }),
  buttons: css({
    footer: {
      borderTop: `solid 2px ${colors.neutral_300}`,
      justifyContent: 'space-between',
    },
  }),
  deleteButton: css({
    button: {
      backgroundColor: `${colors.red_200}`,
    },
  }),
};
