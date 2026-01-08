// @flow
import { useState, useRef, useEffect } from 'react';
import type { SerializedStyles } from '@emotion/react';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import InfoTooltip from '../InfoTooltip';

type Props = {
  content: string,
  displayEllipsisWidth: number,
  displayEllipsisWidthUnit: 'px' | '%' | '',
  styles: {
    wrapper?: SerializedStyles | ObjectStyle,
    content?: SerializedStyles | ObjectStyle,
  },
  onEllipsisChange?: (isEllipsisDisplayed: boolean) => void,
};

const EllipsisTooltipText = (props: Props) => {
  const [isEllipsisDisplayed, setIsEllipsisDisplayed] = useState(false);
  const contentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!props.displayEllipsisWidth || !contentRef.current) {
      return;
    }

    const shouldDisplayEllipsis =
      contentRef.current.clientWidth < contentRef.current.scrollWidth;

    if (props.onEllipsisChange) {
      props.onEllipsisChange(shouldDisplayEllipsis);
    }

    setIsEllipsisDisplayed(shouldDisplayEllipsis);
  }, [props.displayEllipsisWidth, props.onEllipsisChange]);

  const style = {
    wrapper: {
      display: 'inline-flex',
    },
    content: {
      maxWidth: `${props.displayEllipsisWidth}${props.displayEllipsisWidthUnit}`,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: 'normal',
    },
  };

  const textContent = (
    <span ref={contentRef} css={[style.content, props.styles.content]}>
      {props.content}
    </span>
  );

  return (
    <div css={[style.wrapper, props.styles.wrapper]}>
      {isEllipsisDisplayed ? (
        <InfoTooltip placement="bottom-start" content={props.content}>
          {textContent}
        </InfoTooltip>
      ) : (
        textContent
      )}
    </div>
  );
};

EllipsisTooltipText.defaultProps = {
  displayEllipsisWidthUnit: 'px',
  styles: { wrapper: {}, content: {} },
};

export default EllipsisTooltipText;
