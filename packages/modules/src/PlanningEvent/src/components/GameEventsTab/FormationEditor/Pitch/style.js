// @flow

import { css } from '@emotion/react';

const styles = {
  pitchWrapper: css`
    position: relative;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: auto;
    width: 100%;
    max-width: 1200px;
    background: url('/img/pitch-view/pitch-2.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  `,
  inFieldPositionsWrapper: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
};

export default styles;
