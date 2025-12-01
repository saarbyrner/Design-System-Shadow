// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  draggableItem: css({
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    span: {
      fontSize: '1rem',
    },
    'span.icon-add': {
      fontSize: '1rem !important',
      marginRight: '.75rem',
      cursor: 'pointer !important',
    },
    zIndex: 4,
  }),
};
