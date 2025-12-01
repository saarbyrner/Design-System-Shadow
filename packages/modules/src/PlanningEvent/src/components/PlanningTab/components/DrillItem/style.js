// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const ADD_BUTTON_SIZE = '.875rem';

export default {
  drillItem: css({
    backgroundColor: colors.white,
    minHeight: '2.5rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '.2rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.neutral_200,
    },
    ':focus': {
      backgroundColor: colors.neutral_200,
    },
  }),
  drillClickArea: css({
    display: 'flex',
    alignItems: 'center',
    minHeight: '2.5rem',
    width: '100%',
  }),
  drillItemTitle: css({
    color: colors.grey_300,
    fontWeight: 400,
    fontSize: '.75rem',
    lineHeight: '1.25rem',
    marginLeft: '.75rem',
  }),
  dragged: css({
    boxShadow: '0 1px 4px #00000026',
  }),
  dragHandle: css({
    fontSize: '1.5rem',
    cursor: 'grab',
    // dnd-kit’s recommendation.
    // https://docs.dndkit.com/api-documentation/sensors/pointer#touch-action
    touchAction: 'none',
  }),
  pressedDragHandle: css({ cursor: 'grabbing' }),
  addButton: css({
    button: {
      width: ADD_BUTTON_SIZE,
      minWidth: ADD_BUTTON_SIZE,
      padding: 0,

      '&::before': {
        color: colors.grey_300,
        fontSize: ADD_BUTTON_SIZE,
      },
    },
  }),
  baseFavorited: css({
    padding: '0 .5rem',
    color: colors.yellow_100,

    '.iconButton': {
      '&::before': {
        fontSize: '1rem',
      },
    },

    '.iconButton--transparent': {
      color: colors.yellow_100,

      '&:hover': {
        color: colors.grey_100,
      },

      '&:disabled': {
        color: colors.grey_300_50,

        '&:hover': {
          color: colors.grey_300_50,
        },
      },
    },
  }),
  unfavorited: css({
    color: colors.grey_100,

    '.iconButton--transparent': {
      color: colors.grey_100,

      '&:hover': {
        color: colors.yellow_100,
      },
    },
  }),
};
