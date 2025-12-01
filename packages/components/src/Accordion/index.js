// @flow
import { type Node, useEffect, useState, useMemo } from 'react';

import { colors } from '@kitman/common/src/variables';
import ConditionalWrapper from '@kitman/components/src/ConditionalWrapper';
import { getStyles } from './utils/helpers';
import type { TAccordionStyles } from './utils/types';

type Props = {
  title: string | Node,
  content: string | Node,
  isOpen?: boolean,
  iconAlign?: 'left' | 'right',
  type?: 'inlineActions' | 'default',
  titleColour?: string,
  onChange?: Function,
  isRightArrowIcon?: boolean,
  isDisabled?: boolean,
  action?: Node,
  overrideStyles?: TAccordionStyles,
  icon?: string,
};

const Accordion = ({
  title,
  content,
  isDisabled,
  isOpen = false,
  iconAlign,
  titleColour = '',
  onChange,
  isRightArrowIcon = false,
  action,
  overrideStyles = {},
  type,
  icon,
}: Props) => {
  const [active, setActive] = useState(isOpen);
  const isIconAlignLeft = iconAlign === 'left';

  const style = useMemo(() => {
    return getStyles({
      active,
      isIconAlignLeft,
      isRightArrowIcon,
      titleColour,
      overrideStyles,
      type,
    });
  }, [
    active,
    isRightArrowIcon,
    isIconAlignLeft,
    titleColour,
    overrideStyles,
    type,
  ]);

  useEffect(() => {
    setActive(isOpen);
  }, [isOpen]);

  const onTitleClick = () => {
    setActive((currentActive) => !currentActive);
    onChange?.();
  };

  return (
    <div data-testid="Accordion">
      <ConditionalWrapper
        condition={type === 'inlineActions'}
        wrapper={(children) => (
          <div css={style.innerContent} data-testid="accordion-inline-wrapper">
            {children}
          </div>
        )}
      >
        <button
          css={isDisabled ? style.disabledButton : style.button}
          type="button"
          onClick={!isDisabled ? onTitleClick : () => {}}
          disabled={isDisabled}
        >
          <div css={style.title}>{title}</div>
          <span css={style.icon} className={icon || 'icon-down'} />
        </button>
        {action}
      </ConditionalWrapper>

      <div data-testid="accordion-content" css={style.content}>
        {content}
      </div>
    </div>
  );
};

Accordion.defaultProps = {
  isOpen: false,
  iconAlign: 'right',
  titleColour: colors.p03,
  type: 'default',
};

export default Accordion;
