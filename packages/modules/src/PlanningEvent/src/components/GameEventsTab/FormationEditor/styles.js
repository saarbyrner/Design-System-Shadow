// @flow

import { css } from '@emotion/react';

const styles = {
  pitchWrapper: css`
    display: flex;
    flex-direction: row;

    & .pitch {
      width: 100%;
    }
  `,
  modal: css`
    width: 70%;
    min-width: 900px;
    max-width: 1300px;
    margin: auto;
    top: 60px;
    overflow: auto;

    @media (min-width: 1600px) {
      display: table;
    }
  `,
  positionName: (activeCoordinateId?: string) => css`
    margin: 0;
    padding: 5px 24px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
    border-radius: 3px;
    cursor: ${activeCoordinateId ? 'pointer' : 'not-allowed'};
    ${activeCoordinateId &&
    `&:hover {
      background-color: #34495e;
      color: #fff;
    }`}
  `,
};

export default styles;
