// @flow

import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const textButtonClassPrefix = '.textButton--kitmanDesignSystem';
const iconClassBeforePseudoElement = '.textButton__icon::before';
const iconOnlyClass = `${textButtonClassPrefix}--iconOnly`;
const linkClass = `${textButtonClassPrefix}--link`;

export default {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    background: 'white',
  }),
  leftSideContainer: css({
    display: 'flex',
    columnGap: '1rem',
    [iconOnlyClass]: {
      display: 'flex',
      justifyContent: 'center',
      height: '2rem',
      width: '2rem',
    },
    [`${iconOnlyClass} ${iconClassBeforePseudoElement}`]: {
      fontWeight: 'bold',
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      '.show-filters-button': {
        padding: 0,
        width: '2rem',
        height: '2rem',
        '.textButton__text': {
          display: 'none',
        },
      },
    },
  }),
  viewOptionsContainer: css({
    display: 'flex',
    columnGap: '1rem',
    [`${linkClass}`]: {
      padding: 0,
    },
    [`${linkClass} ${iconClassBeforePseudoElement}`]: {
      fontSize: '1.5rem',
      color: colors.grey_200,
    },
  }),
  separator: css({
    borderLeft: `0.125rem ${colors.neutral_300} solid`,
    borderRadius: '0.065rem',
  }),
  pageTitle: css({
    margin: 0,
    lineHeight: '2rem',
  }),
  titleContainer: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    gap: '0.5rem',
    '& .MuiButton-root': {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      padding: '0 0.5rem',
      height: '2rem',
    },
  }),
};
