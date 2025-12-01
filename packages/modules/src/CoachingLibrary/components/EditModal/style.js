// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  modal: css({
    minHeight: '19rem',
  }),
  text: css({
    paddingTop: '.2rem',
    marginBottom: '.5rem',
  }),
  squads: css({
    fontSize: '.6875rem',
    color: colors.grey_100,
  }),
  buttons: css({
    footer: {
      borderTop: `solid 2px ${colors.neutral_300}`,
      justifyContent: 'space-between',
    },
  }),
};
