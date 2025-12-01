// @flow
import { css } from '@emotion/react';
import type { Node } from 'react';
import { useEffect, useCallback } from 'react';
import { colors, zIndices } from '@kitman/common/src/variables';

export type Props = {
  width: number,
  title?: Node,
  children?: Node,
  onClose: Function,
  animate?: boolean,
  isOpen: boolean,
};

const ExpandingPanel = (props: Props) => {
  const onCloseProp = props.onClose;

  // Close the panel when the user presses escape
  const onKeydown = useCallback(
    (event: any) => {
      if (event.keyCode === 27) {
        onCloseProp();
      }
    },
    [onCloseProp]
  );

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener('keydown', onKeydown, false);
    } else {
      document.removeEventListener('keydown', onKeydown, false);
    }
    return () => {
      document.removeEventListener('keydown', onKeydown, false);
    };
  }, [props.isOpen, onKeydown]);

  const style = {
    expandingPanel: css`
      width: ${props.isOpen ? `${props.width}px` : '0'};
      max-width: 100vw;
      height: 100%;
      min-height: 100vh;
      min-height: -webkit-fill-available;
      min-height: -moz-available;
      min-height: stretch;
      max-height: 100vh;
      max-height: -webkit-fill-available;
      max-height: -moz-available;
      max-height: stretch;
      display: flex;
      flex-direction: column;
      position: static;
      overflow-x: clip;
      z-index: ${zIndices.slidingPanel};
      visibility: ${props.isOpen ? 'visible' : 'hidden'};
      label: ${props.isOpen ? `root--Open` : 'root--Closed'};
      ${props.animate === true &&
      `
      -webkit-transition: 0.3s ease;
      transition: 0.3s ease;
      transition-property: width, visibility;
      `}
    `,
    heading: css`
      align-items: center;
      width: ${props.width}px;
      max-width: 100vw;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid ${colors.neutral_300};
      height: 80px;
      min-height: 80px;
    `,
    title: css`
      color: ${colors.grey_200};
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      margin: 0 0 0 24px;
      label: title;
    `,
    closeButton: css`
      background: transparent;
      border: 0;
      color: ${colors.neutral_400};
      font-size: 22px;
      margin-right: 20px;
      padding: 0;
      :hover {
        cursor: pointer;
      }
    `,
  };

  return (
    <div data-testid="ExpandingPanel" css={style.expandingPanel}>
      <div css={style.heading}>
        <span css={style.title}>{props.title}</span>
        <button
          type="button"
          onClick={onCloseProp}
          css={style.closeButton}
          className="icon-close"
        />
      </div>
      {props.children}
    </div>
  );
};
export const defaultWidth = 460;
ExpandingPanel.defaultProps = {
  isOpen: false,
  title: '',
  onClose: () => {},
  width: defaultWidth,
  animate: true,
};

export default ExpandingPanel;
