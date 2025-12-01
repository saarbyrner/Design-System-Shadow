// @flow
import { css } from '@emotion/react';
import type { Props } from './index';

const style = (props: Props) => {
  return {
    eventTooltip: css`
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-width: 400px;
    `,
    eventTypeSelection: css`
      margin-bottom: 8px;
    `,
    colorBlock: css`
      border-radius: 5px;
      display: block;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      background: ${props.calendarEvent?.backgroundColor};
      border: 1px solid
        ${props.calendarEvent?.borderColor ||
        props.calendarEvent?.backgroundColor};
    `,
    titleBlock: css`
      display: flex;
      align-self: flex-start;
      align-items: center;
    `,
    titleText: css`
      margin-bottom: 0;
    `,
    squad: css`
      margin: 0;
    `,
    iconContainer: css`
      display: flex;
      align-items: center;
      gap: 2px;
    `,
    description: css`
      margin-top: 8px;
      margin-bottom: 8px;
    `,
    header: css`
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `,
    content: css`
      margin-top: 16px;
      margin-bottom: 16px;
    `,
    footer: css`
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    `,
    buttonsRight: css`
      display: flex;
      gap: 8px;
    `,
    buttonsLeft: css`
      display: flex;
      gap: 8px;
    `,
  };
};

export default style;
