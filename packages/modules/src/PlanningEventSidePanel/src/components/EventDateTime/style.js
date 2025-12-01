// @flow
import { css } from '@emotion/react';

const style = {
  eventDateTime: css`
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  date: css`
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
  `,
  startTime: css`
    grid-row: 2 / 3;
    .timePicker__label {
      line-height: 20px;
    }
  `,
  endTime: css`
    grid-row: 2 / 3;
  `,
  duration: css`
    grid-row: 2 / 3;
  `,
  timezone: css`
    grid-row: 2 / 3;
    line-height: 16px;
    .kitmanReactSelect__menu {
      position: absolute;
      right: 0;
      top: 30px;
    }
  `,
};

export default style;
