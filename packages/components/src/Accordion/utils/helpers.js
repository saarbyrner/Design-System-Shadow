// @flow

import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';
import type { TAccordionStyles } from './types';

type TGetIconRotation = {
  active: boolean,
  isRightArrowIcon: boolean,
};

const getIconRotation = ({ active, isRightArrowIcon }: TGetIconRotation) => {
  if (active) {
    if (isRightArrowIcon) {
      return 'rotate(360deg)';
    }
    return 'rotate(180deg)';
  }
  if (isRightArrowIcon) {
    return 'rotate(270deg)';
  }
  return 'rotate(0deg)';
};

type TGetStyles = {
  titleColour: string,
  isIconAlignLeft: boolean,
  isRightArrowIcon: boolean,
  active: boolean,
  overrideStyles: TAccordionStyles,
  type?: 'inlineActions' | 'default',
};

export const getStyles = ({
  titleColour,
  isIconAlignLeft,
  isRightArrowIcon,
  active,
  overrideStyles,
  type,
}: TGetStyles): TAccordionStyles => {
  const button = css(
    {
      alignItems: 'center',
      backgroundColor: 'transparent',
      border: 0,
      color: titleColour,
      display: 'flex',
      justifyContent: isIconAlignLeft ? 'flex-start' : 'space-between',
      outline: 'none',
      padding: 0,
      width: '100%',
    },
    { ...overrideStyles.button }
  );

  return {
    button,
    disabledButton: css`
      align-items: center;
      background-color: transparent;
      border: 0;
      color: ${colors.grey_100};
      opacity: 50%;
      display: flex;
      justify-content: ${isIconAlignLeft ? 'flex-start' : 'space-between'};
      outline: none;
      padding: 0;
      width: 100%;
    `,
    title: css(
      {
        order: isIconAlignLeft ? 2 : 1,
        width: isRightArrowIcon ? '100%' : null,
      },
      { ...overrideStyles.title }
    ),
    icon: css`
      font-weight: 600;
      margin: ${isIconAlignLeft ? '0 5px 0 0' : '0 0 0 22px'};
      order: ${isIconAlignLeft ? 1 : 2};
      transition: transform 0.2s ease-out;
      transform: ${getIconRotation({ active, isRightArrowIcon })};
    `,
    content: css(
      {
        display: `${active ? 'block' : 'none'}`,
      },
      { ...overrideStyles.content }
    ),
    innerContent: css(
      {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '8px 0px',
        borderBottom:
          !active && type === 'inlineActions'
            ? `2px solid ${colors.neutral_300}`
            : 'none',
      },
      { ...overrideStyles.innerContent }
    ),
  };
};

export default {};
