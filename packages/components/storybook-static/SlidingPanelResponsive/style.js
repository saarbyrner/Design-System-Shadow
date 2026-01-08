// @flow
import { css } from '@emotion/react';
import { colors, zIndices, shadows } from '@kitman/common/src/variables';

const style = (width: number, isOpen: boolean, animate?: boolean) => ({
  slidingPanel: css`
    background: ${colors.p06};
    box-shadow: ${shadows.sidePanel};
    width: ${`${width}px`};
    max-width: 100%;
    max-height: 100vh;
    max-height: -webkit-fill-available;
    max-height: -moz-available;
    max-height: stretch;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    min-height: -moz-available;
    min-height: stretch;
    height: 100%;
    display: flex;
    top: 0;
    flex-direction: column;
    position: fixed;
    overflow-x: auto;
    z-index: ${zIndices.slidingPanel};
    visibility: ${isOpen ? 'visible' : 'hidden'};
    label: ${isOpen ? `root--Open` : 'root--Closed'};
    right: ${isOpen ? 0 : -width}px;
    border-left: 1px solid ${colors.neutral_300};

    ${animate === true &&
    `
    -webkit-transition: 0.2s ease;
    transition: 0.2s ease;
    transition-property: right, visibility;
    `}
  `,
  heading: css`
    align-items: center;
    width: ${width}px;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${colors.neutral_300};
    height: 80px;
    min-height: 80px;
  `,
  titleContainer: css`
    display: flex;
    flex-direction: column;
    grow: 1;
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
  content: css`
    background: ${colors.p06};
  `,
});

export const childrenStyles = {
  content: css`
    overflow: auto;
    padding: 24px;
    flex: 1;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
    gap: 8px;
  `,
};

export default style;
