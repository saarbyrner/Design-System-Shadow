// @flow
import { css } from '@emotion/react';
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import EllipsisTooltipText from '../EllipsisTooltipText';

type Props = {
  content: string,
  children?: Node,
  backgroundColor?: string,
  textColor?: string,
  fontSize?: number,
  displayEllipsisWidth?: number,
  closeable?: boolean,
  clickable?: boolean,
  isDisabled?: boolean,
  onClose?: Function,
  onTagClick?: Function,
  wrapperCustomStyles?: {},
};

export const defaultDisplayEllipsisWidth = 280;

const TextTag = (props: Props) => {
  const backgroundColor = props.backgroundColor || colors.neutral_200;
  const textColor = props.textColor || colors.grey_300;

  const style = {
    wrapper: css`
      align-items: center;
      background-color: ${backgroundColor};
      border-radius: 3px;
      color: ${textColor};
      display: inline-flex;
      line-height: 14px;
      padding: 3px 5px;
      font-size: 11px;
      ${props.fontSize &&
      `
      font-size: ${props.fontSize}px;
      line-height: ${props.fontSize + 8}px;
      padding: 0px 4px;
    `};
      ${props.wrapperCustomStyles && props.wrapperCustomStyles}
    `,
  };

  const textTagContent = (
    <>
      <EllipsisTooltipText
        content={props.content}
        displayEllipsisWidth={
          props.displayEllipsisWidth || defaultDisplayEllipsisWidth
        }
      />
      {props.children && props.children}
    </>
  );

  return (
    <div data-testid="TextTag" css={style.wrapper}>
      {props.clickable && props.onTagClick ? (
        <button
          css={css`
            background-color: transparent;
            border: 0;
            color: ${props.isDisabled ? colors.grey_100_50 : colors.blue_100};
            cursor: ${props.isDisabled ? 'not-allowed' : 'pointer'};
            padding: 0;
            outline: none;
          `}
          type="button"
          onClick={props.onTagClick}
          disabled={props.isDisabled}
        >
          {textTagContent}
        </button>
      ) : (
        textTagContent
      )}
      {props.closeable && props.onClose && (
        <button
          css={css`
            background-color: ${props.isDisabled
              ? 'transparent'
              : backgroundColor};
            border: 0;
            color: ${props.isDisabled && colors.grey_100_50};
            cursor: ${props.isDisabled ? 'not-allowed' : 'pointer'};
            font-size: 10px;
            margin: 2px 0 0 5px;
            padding: 0;
            outline: none;
            i {
              font-weight: bold;
            }
          `}
          type="button"
          onClick={props.onClose}
          disabled={props.isDisabled}
        >
          <i className="icon-close" />
        </button>
      )}
    </div>
  );
};

TextTag.defaultProps = {
  closeable: false,
};

export default TextTag;
