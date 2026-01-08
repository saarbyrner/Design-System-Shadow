// @flow

import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

import type { TAccordionStyles } from '@kitman/components/src/Accordion/utils/types';

export const accordionOverrideStyles: TAccordionStyles = {
  button: css({ height: '3rem', padding: '0.25rem 1rem' }),
};

export const checkboxLiStyleOverride = css({
  marginBottom: '0.25rem',
  '.reactCheckbox__checkbox': {
    marginRight: '0.5rem',
  },
});

type TCreateAccordionContentStyles = {
  includeBorderBottom: boolean,
  rowGapRem?: number,
};

export const createAccordionContentStyles = ({
  includeBorderBottom,
  rowGapRem = 0.5,
}: TCreateAccordionContentStyles) => {
  return css({
    padding: '0 1.5rem',
    rowGap: `${rowGapRem}rem`,
    display: 'flex',
    flexDirection: 'column',
    ...(includeBorderBottom
      ? { borderBottom: `1px solid ${colors.neutral_300}` }
      : {}),
  });
};

const heightAboveSlidingPanel = '18rem';

export const createSlidingPanelStyles = (isPanelOpen: boolean) =>
  css({
    visibility: isPanelOpen ? 'visible' : 'hidden',
    height: `calc(100vh - ${heightAboveSlidingPanel})`,
    overflow: 'scroll',
  });

export default {};
